import { createClient } from "../../utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export default async function SupabasePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  async function addTodo(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    if (title) {
      await supabase.from("todos").insert({ title }).select();
      revalidatePath("/SupabaseData");
    }
  }

  const { data: todos } = await supabase
    .from("todos")
    .select()
    .order("created_at", { ascending: false });


  return (
    <div style={{ padding: "20px" }} className="flex justify-center items-center flex-col gap-4">
      <h1>My Todos</h1>

      <form action={addTodo} style={{ marginBottom: "20px" }}>
        <input
          name="title"
          type="text"
          placeholder="Что нужно сделать?"
          required
          style={{ padding: "8px", marginRight: "10px", color: "black" , border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <button type="submit" className="p-[8px_10px] cursor-pointer bg-blue-500 text-white rounded">
          Добавить
        </button>
      </form>

      <ul className="w-full max-w-md">
        {todos?.map((todo) => (
          <li
            key={todo.id}
            className="border-b py-2 flex justify-between items-center"
          >
            {/* Вот здесь мы выводим конкретное поле title */}
            <span className="text-lg">{todo.title}</span>

            <span className="text-xs text-gray-500">
              {new Date(todo.created_at).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}