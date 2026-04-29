import { useState, useEffect } from "react";
import { createClient } from "../../../src/utils/supabase/client";
import { useUser } from "../../context/UserContext";
import {
  ShieldCheck,
  User,
  Calendar,
  CreditCard,
  History,
  Users,
  Activity,
  ChevronRight,
} from "lucide-react";

// Тип для отдельной транзакции из истории
interface Transaction {
  id: string;
  amount: number;
  paid_at: string;
  months_paid: number;
  user_id: string;
  profiles: {
    name: string | null;
    surname: string | null;
  } | null;
}

// Тип для состояния статистики
interface Stats {
  newUsers: number;
  subscriptionGrowth: number;
  newPayers: number;
}

const AdminPanel = () => {
  const supabase = createClient();
  const [months, setMonths] = useState(1);
  const [targetId, setTargetId] = useState("");
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 7),
  );
  const [revenue, setRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<Stats>({
    newUsers: 0,
    subscriptionGrowth: 0,
    newPayers: 0,
  });

  const fetchStats = async (dateString: any) => {
    const startOfMonth = new Date(`${dateString}-01`);
    const endOfMonth = new Date(
      startOfMonth.getFullYear(),
      startOfMonth.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    // 1. Считаем новые регистрации (профили)
    const { count: newUsersCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfMonth.toISOString())
      .lte("created_at", endOfMonth.toISOString());

    // 2. Получаем ВСЮ историю платежей (отсортированную), чтобы вычислить обе метрики за раз
    const { data: allPayments, error: payError } = await supabase
      .from("payment_history")
      .select("user_id, paid_at")
      .order("paid_at", { ascending: true });

    if (payError) {
      console.error("Ошибка загрузки платежей:", payError);
      return;
    }

    // --- ЛОГИКА ОБРАБОТКИ ---

    // Карта для поиска самых первых оплат в истории
    const firstPaymentMap: any = {};
    // Сет для уникальных пользователей именно В ЭТОМ месяце
    const currentMonthUniqueUsers = new Set();

    allPayments.forEach((payment) => {
      const payDate = new Date(payment.paid_at);

      // Запоминаем самую первую оплату пользователя (для "Новых покупателей")
      if (!firstPaymentMap[payment.user_id]) {
        firstPaymentMap[payment.user_id] = payDate;
      }

      // Если эта оплата была в выбранном месяце, добавляем в уникальные (для "С подпиской")
      if (payDate >= startOfMonth && payDate <= endOfMonth) {
        currentMonthUniqueUsers.add(payment.user_id);
      }
    });

    // Фильтруем карту первых оплат, оставляя только те, что случились в этом месяце
    const newPayersCount = Object.values(firstPaymentMap).filter(
      (date: any) => date >= startOfMonth && date <= endOfMonth,
    ).length;

    setStats({
      newUsers: newUsersCount || 0,
      subscriptionGrowth: currentMonthUniqueUsers.size, // Уникальные за месяц
      newPayers: newPayersCount, // Купившие ВПЕРВЫЕ в этом месяце
    });
  };

  useEffect(() => {
    fetchStats(selectedDate);
  }, [selectedDate]);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from("payment_history")
      .select(
        `
      id,
      amount,
      paid_at,
      months_paid,
      user_id,
      profiles (
        name,
        surname
      )
    `,
      )
      .order("paid_at", { ascending: false })
      .limit(10); // Берем последние 10 для истории

    if (!error && data) setTransactions(data as unknown as Transaction[]);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const getMonthWord = (number: any) => {
    const cases = [2, 0, 1, 1, 1, 2];
    const titles = ["мес.", "мес.", "мес."]; // Для краткости как в макете
    return titles[
      number % 100 > 4 && number % 100 < 20
        ? 2
        : cases[number % 10 < 5 ? number % 10 : 5]
    ];
  };

  const fetchRevenue = async (dateString: any) => {
    setIsLoading(true);

    // Вызываем нашу SQL функцию через .rpc()
    const { data, error } = await supabase.rpc("get_monthly_revenue", {
      target_month: `${dateString}-01`, // передаем как первый день месяца
    });

    if (error) {
      console.error("Ошибка при получении дохода:", error);
    } else {
      setRevenue(data);
    }
    setIsLoading(false);
  };

  // Загружаем данные при монтировании и изменении даты
  useEffect(() => {
    fetchRevenue(selectedDate);
  }, [selectedDate]);

  const handleActivate = async () => {
    if (!targetId) return alert("Введите ID репетитора");
    const { error } = await supabase.rpc("activate_custom_sub", {
      target_user_id: targetId,
      months_to_add: months,
    });

    if (error) {
      alert("Ошибка: " + error.message);
    } else {
      alert(`Успешно активировано!`);
      setTargetId("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-2 ">
      <div className="max-w-[1250px] mx-auto ">
        {/* Шапка панели */}

        <div className="grid w-full  gap-6">
          {/* ЛЕВАЯ КОЛОНКА: Форма активации */}
          <div className=" space-y-8">
            <section className="bg-white border border-gray-100 rounded-[32px] p-6 md:p-10 shadow-xl shadow-blue-900/5">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-600/30">
                  <CreditCard size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Активация подписки
                  </h2>
                  <p className="text-sm text-gray-400">
                    Ручное продление доступа для репетиторов
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                    Идентификатор пользователя
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Введите UUID репетитора..."
                      value={targetId}
                      onChange={(e) => setTargetId(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-gray-100 rounded-[20px] bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-gray-700 font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                      Период доступа
                    </label>
                    <div className="relative">
                      <Calendar
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="number"
                        value={months}
                        onChange={(e) => setMonths(parseInt(e.target.value))}
                        className="w-full pl-12 pr-4 py-4 border border-gray-100 rounded-[20px] bg-gray-50 focus:bg-white transition-all outline-none appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                      Сумма к оплате
                    </label>
                    <div className="py-4 px-6 bg-blue-50 text-blue-700 rounded-[20px] border border-blue-100 flex items-center justify-between">
                      <span className="font-bold text-lg">
                        {(20000 * months).toLocaleString()}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                        UZS
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleActivate}
                  className="w-full py-5 bg-gray-900 cursor-pointer text-white font-bold rounded-[22px] hover:bg-blue-600 transition-all shadow-xl hover:shadow-blue-500/25 active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={20} />
                  Подтвердить транзакцию
                </button>
              </div>
            </section>
          </div>

          {/* ПРАВАЯ КОЛОНКА: Аналитика и Отчетность */}
          <div className="space-y-6">
            {/* Основной виджет дохода */}
            <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-xl shadow-blue-900/5">
              <div className="flex items-center justify-between mb-6">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Activity
                    size={20}
                    className={isLoading ? "animate-pulse" : ""}
                  />
                </div>

                <input
                  type="month"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="text-xs font-bold text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                />
              </div>

              <p className="text-gray-400 text-sm font-medium">
                Доход за месяц
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-3xl font-black text-gray-900">
                  {revenue.toLocaleString()}
                </h3>
                <span className="text-gray-400 text-xs font-bold">UZS</span>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-[10px] uppercase tracking-widest font-black">
                  <span className="text-gray-300">Цель: 482,000 UZS</span>
                  <span className="text-blue-600">
                    {Math.min(Math.round((revenue / 482000) * 100), 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.min((revenue / 482000) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Детализация по периодам */}
            <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
                <Users size={18} className="text-blue-500" /> Статистика спроса
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Карточка 1: Процент подписчиков */}
                <div className="bg-gray-50/50 border border-gray-100 rounded-[24px] p-6">
                  <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-2">
                    Пользователей с подпиской
                  </p>
                  <div className="flex items-baseline gap-1">
                    <h3 className="text-2xl font-black text-gray-900">
                      +{stats.subscriptionGrowth}
                    </h3>
                  </div>
                </div>

                {/* Карточка 2: Новые пользователи */}
                <div className="bg-gray-50/50 border border-gray-100 rounded-[24px] p-6">
                  <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-2">
                    Новых покупателей
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-black text-gray-900">
                      +{stats.newPayers}
                    </h3>
                    <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                      First Pay
                    </span>
                  </div>
                </div>
              </div>

              {/* Список последних действий скроллируемый */}
              <div className="mt-8 ">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                  История транзакций
                </h4>
                <div className="space-y-4 max-h-[400px]  overflow-y-auto no-scrollbar pr-2">
                  {transactions.map((tx: any) => (
                    <div
                      key={tx.id}
                      className="flex  cursor-pointer items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        {/* Иконка или инициалы пользователя */}
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase">
                          {tx.profiles?.name?.[0] || "ID"}
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-gray-900">
                            Подписка: {tx.months_paid}{" "}
                            {getMonthWord(tx.months_paid)}
                          </h4>
                          <p className="text-[11px] text-gray-400 font-medium">
                            {new Date(tx.paid_at).toLocaleString("ru-RU", {
                              day: "numeric",
                              month: "long",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-green-600">
                          +{(tx.amount / 1000).toFixed(0)}k
                        </span>
                        <ChevronRight
                          size={14}
                          className="text-gray-200 ml-2 inline-block group-hover:text-gray-400 transition-colors"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
