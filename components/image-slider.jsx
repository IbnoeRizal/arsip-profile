"use client";
import { useState } from "react";
import Image from "next/image";

const images = [
  {
    src: "/gambar-tentang-sekolah/jalan sekolah.jpg",
    caption: "Jalan depan sekolah SDN 2 Gedog",
  },
  {
    src: "/gambar-tentang-sekolah/pemandangan-depan-sekolah.jpg",
    caption: "Pemandangan sekolah yang luas dan asri",
  },
  {
    src: "/gambar-tentang-sekolah/senam pagi di sekolah.jpeg",
    caption: "Senam pagi",
  },
  {
    src: "/gambar-tentang-sekolah/upacara bendera.jpeg",
    caption: "Upacara hari senin",
  },
];

export default function ImageSlider() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((current - 1 + images.length) % images.length);
  const next = () => setCurrent((current + 1) % images.length);

  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden">
      {/* Slides */}
      <div
        className="flex transition-transform duration-400 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((img, i) => (
          <div key={i} className="min-w-full relative h-72 md:h-96">
            <Image
              src={img.src}
              alt={img.caption}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Tombol kiri */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center transition"
      >
        &#8592;
      </button>

      {/* Tombol kanan */}
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center transition"
      >
        &#8594;
      </button>

      {/* Keterangan gambar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-sm text-center py-2 px-4">
        {images[current].caption}
      </div>

      {/* Dot indikator */}
      <div className="absolute top-3 right-3 flex gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition ${
              i === current ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}