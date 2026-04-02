"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useModal } from "../../context/ModalContext";
import { createClient } from "../../utils/supabase/client";
import { Session, AuthChangeEvent } from '@supabase/supabase-js';

export default function SignInForm() {
    const supabase = createClient();
    const { isOpen, closeModal } = useModal();

    // Состояния полей формы
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState(''); // Для регистрации
    const [role, setRole] = useState('Student');   // Для регистрации

    // Состояние пользователя
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const getInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUserEmail(session?.user?.email ?? null);
        };
        getInitialSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event: AuthChangeEvent, session: Session | null) => {
                setUserEmail(session?.user?.email ?? null);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase]);

    const handleSignIn = async () => {
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            closeModal(); // Закрываем после успешного входа
        } catch (error: any) {
            alert('Ошибка входа: ' + error.message);
        }
    };

    const handleSignUp = async () => {
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { name, role } // Сохраняем доп. данные в metadata
                }
            });
            if (error) throw error;
            alert('Проверьте почту для подтверждения!');
            closeModal();
        } catch (error: any) {
            alert('Ошибка регистрации: ' + error.message);
        }
    };

    const handleSignOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();

            if (error) throw error;

            console.log('Sign out');
            setUserEmail(null);

        } catch (error) {
            console.error('Ошибка при выходе:', error.message);
        }
    };

    // Общий обработчик для кнопки
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            handleSignIn();
        } else {
            handleSignUp();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="min-h-screen z-[999] min-w-screen flex items-center fixed inset-0 justify-center bg-gray-600/30 p-4"
        >
            <div
                className="w-full max-w-[400px] bg-white rounded-xl flex items-center flex-col shadow-lg border border-gray-200 relative overflow-hidden"
                onClick={(e) => e.stopPropagation()} // Чтобы клик внутри не закрывал модалку
            >
                <button
                    className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={closeModal}
                >
                    <X size={20} strokeWidth={1.5} />
                </button>

                <div className="p-8 w-full">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                        {isLogin ? 'Войти' : 'Зарегистрироваться'}
                    </h2>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className='flex flex-col gap-3'>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-gray-700">Роль</label>
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full cursor-pointer px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm"
                                    >
                                        <option value="Student">Ученик</option>
                                        <option value="Tutor">Репетитор</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5 ">
                                    <label className="block text-sm font-medium text-gray-700">Имя пользователя</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Введите ваше имя"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700">Пароль</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="abc12345678"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full bg-blue-500 cursor-pointer text-white font-medium py-3 rounded-lg hover:bg-[#2563EB] active:bg-[#1E40AF] transition-colors text-sm"
                            >
                                {isLogin ? 'Войти' : 'Зарегистрироваться'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-600">
                            {!isLogin ? "Уже есть аккаунт?" : "Впервые тут?"}
                        </span>
                        {' '}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-blue-500 hover:text-[#2563EB] cursor-pointer font-medium transition-colors"
                        >
                            {!isLogin ? 'Войти' : 'Зарегистрироваться'}
                        </button>
                    </div>
                </div>

                <div className='mb-4 text-xs text-gray-500'>
                    {userEmail ? (
                        <p>Вы вошли как: <span className="font-semibold">{userEmail}</span></p>
                    ) : (
                        <p>Вы не авторизованы</p>
                    )}
                </div>
                <button
                    onClick={() => handleSignOut()}
                    className='text-red-500 mb-4 cursro-pointer'
                >Выйти из профиля</button>
            </div>
        </div>
    );
}