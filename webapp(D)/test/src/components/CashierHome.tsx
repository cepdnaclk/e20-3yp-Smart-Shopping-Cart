import React from 'react';
import { motion } from 'framer-motion';
import cashierImg from '../assets/cashier.jpeg';
import {useNavigate} from 'react-router-dom';

const CashierHome: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
      {/* Header */}
      <header className="flex justify-between items-center px-10 py-6 shadow-md bg-white sticky top-0 z-10">
        <div className="text-3xl font-bold text-indigo-600">Smart Shopping</div>
        <nav className="space-x-6 text-gray-700 font-medium">
          <a href="#" className="hover:text-indigo-600">Home</a>
          <a href="#" className="hover:text-indigo-600">Profile</a>
          <a href="#" className="hover:text-indigo-600">Logout</a>
          {/*<a href="#" className="hover:text-indigo-600">Info</a>*/}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex flex-col-reverse lg:flex-row items-center justify-between px-10 py-20 gap-16 max-w-7xl mx-auto">
        
        {/* Animated Text Section */}
        <motion.div
          className="lg:w-1/2 space-y-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
            Working with the{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Cashier
            </span>
          </h1>
          <p className="text-lg text-gray-600">
            Designed to help cashiers work faster and smarter — no more manual updates or long lines, just smooth and accurate billing.
          </p>
          <ul className="text-gray-700 space-y-2 text-base list-disc list-inside">
            <li>⚡ Faster queue handling</li>
            <li>🛒 Easy-to-use cashier UI</li>
            <li>🔁 Auto updates of checkout results</li>
          </ul>
          <motion.button
            onClick={() => navigate('/cart-entry')}
            className="mt-6 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-lg transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
        </motion.div>

        {/* Animated Image Section */}
        <motion.div
          className="lg:w-1/2 flex justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <img
              src={cashierImg}
              alt="Cashier Illustration"
              className="w-[400px] h-auto sm:w-[500px] lg:w-[600px] xl:w-[650px] rounded-xl"
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default CashierHome;
