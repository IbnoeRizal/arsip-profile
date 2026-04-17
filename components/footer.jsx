"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white mt-10">
      <div className="container mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">

        {/* LOGO + DESKRIPSI */}
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-2xl font-bold mb-3"
          >
            SDN 2 Gedog
          </motion.h1>

          <p className="text-gray-300 text-sm">
            Website resmi SD Negeri 2 Gedog yang menyediakan informasi sekolah, guru dan staff.
          </p>
        </div>

        {/* ALAMAT */}
        <div>
          <h2 className="font-semibold mb-3">Alamat</h2>

          <motion.a
            href="https://www.google.com/maps?q=Jln.+Irogati+No.+11+Gedog+Blitar"
            target="_blank"
            whileHover={{ scale: 1.05 }}
            className="flex items-start gap-3 text-gray-300 hover:text-white"
          >
            <MapPin />
            <span>
              Jln. Irogati No. 11 Kel. Gedog Kec. Sananwetan Kota Blitar 
              Kode Pos 66132
            </span>
          </motion.a>
        </div>

        {/* KONTAK */}
        <div>
          <h2 className="font-semibold mb-3">Kontak</h2>

          <div className="flex flex-col gap-3">

            {/* TELEPON */}
            <motion.a
              href="tel:081335676553"
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 text-gray-300 hover:text-white"
            >
              <Phone />
              <span>081335676553</span>
            </motion.a>

            {/* EMAIL */}
            <motion.a
              href="mailto:sdgedog@gmail.com"
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 text-gray-300 hover:text-white"
            >
              <Mail />
              <span>sdgedog@gmail.com</span>
            </motion.a>

          </div>
        </div>

      </div>

      {/* COPYRIGHT */}
      <div className="text-center text-gray-400 text-sm py-4 border-t border-gray-700">
        © {new Date().getFullYear()} SDN 2 Gedog. All rights reserved.
      </div>
    </footer>
  );
}