"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";

// Komponen Mini Confetti khusus buat Kado
const GiftParticles = () => {
  const colors = ["#f43f5e", "#3b82f6", "#fbbf24", "#34d399", "#a78bfa"];
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{
            x: (Math.random() - 0.5) * 250,
            y: -(Math.random() * 250 + 50),
            scale: Math.random() * 1.5 + 0.5,
            opacity: 0,
            rotate: Math.random() * 360,
          }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="w-3 h-3 rounded-sm absolute"
          style={{ backgroundColor: colors[i % colors.length] }}
        />
      ))}
    </div>
  );
};

// Komponen Kado Estetik ala Kue
const CSSGift = ({ boxColor, isOpened }: { boxColor: string; isOpened: boolean }) => (
  <div className={`relative w-24 md:w-32 flex flex-col items-center transition-all duration-700 ${isOpened ? "opacity-50 grayscale" : "hover:brightness-110"}`}>
    <div className="absolute -top-6 md:-top-8 flex justify-center w-full z-10">
      <div className="w-8 h-8 md:w-10 md:h-10 border-[6px] border-amber-300 rounded-full -mr-2 md:-mr-3 shadow-sm" />
      <div className="w-8 h-8 md:w-10 md:h-10 border-[6px] border-amber-300 rounded-full -ml-2 md:-ml-3 shadow-sm" />
    </div>
    <div className={`w-28 md:w-36 h-8 md:h-10 ${boxColor} rounded-md z-20 border-b-[6px] border-black/20 shadow-lg relative overflow-hidden`}>
       <div className="absolute left-1/2 -translate-x-1/2 w-6 md:w-8 h-full bg-amber-300" />
    </div>
    <div className={`w-24 md:w-32 h-20 md:h-24 ${boxColor} rounded-b-xl z-10 relative overflow-hidden shadow-2xl border-b-4 border-black/20`}>
       <div className="absolute left-1/2 -translate-x-1/2 w-6 md:w-8 h-full bg-amber-300 shadow-sm" />
       <div className="absolute top-1/2 -translate-y-1/2 w-full h-6 md:h-8 bg-amber-300 shadow-sm" />
    </div>
  </div>
);

export default function Home() {
  const [phase, setPhase] = useState(0);
  const [textPhase, setTextPhase] = useState(0); 
  const [blowCount, setBlowCount] = useState(0);
  const [isCandleLit, setIsCandleLit] = useState(false);
  const [showMainConfetti, setShowMainConfetti] = useState(false);
  
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [photoRain, setPhotoRain] = useState<any[]>([]);

  const audioRef = useRef<HTMLAudioElement>(null);

  // State Dinamis Kado
  const [openedGiftsCount, setOpenedGiftsCount] = useState(0);
  const [leftGiftText, setLeftGiftText] = useState("");
  const [leftGiftImg, setLeftGiftImg] = useState("");
  const [rightGiftText, setRightGiftText] = useState("");
  const [rightGiftImg, setRightGiftImg] = useState("");
  const [boomLeft, setBoomLeft] = useState(false);
  const [boomRight, setBoomRight] = useState(false);
  const [activePopup, setActivePopup] = useState<{ img: string; title: string } | null>(null);
  
  const [showFinalText, setShowFinalText] = useState(true);

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const drops = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: Math.random() * 10 + 12,
      picIndex: (i % 7) + 1,
      rotateStart: Math.random() * 40 - 20,
      rotateEnd: Math.random() * 80 - 40,
    }));
    setPhotoRain(drops);
  }, []);

  const answers = ["Dhio Ganteng", "Amanda", "Ucup", "Akmal"];

  const handleAnswer = (answer: string) => {
    if (answer === "Amanda") {
      if (audioRef.current) {
        audioRef.current.volume = 0.6;
        audioRef.current.play();
      }
      setPhase(1);
    } else {
      alert("Yahahaha salah, coba lagi ya!");
    }
  };

  useEffect(() => {
    if (phase === 1) {
      const t1 = setTimeout(() => setTextPhase(1), 3500); 
      const t2 = setTimeout(() => setTextPhase(2), 7000); 
      const t3 = setTimeout(() => setPhase(2), 11000); 
      
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [phase]);

  const handleBlow = () => {
    const newCount = blowCount + 1;
    setBlowCount(newCount);
    
    if (newCount >= 3) {
      setIsCandleLit(false);
      setShowMainConfetti(false);
      setTimeout(() => setPhase(3), 2000);
    }
  };

  // Logika Buka Kado yang sudah disesuaikan
  const handleOpenGift = (side: "left" | "right") => {
    const isFirstGift = openedGiftsCount === 0;

    if (side === "left") {
      if (leftGiftText) {
        // Kalau sudah dibuka, tampilkan lagi data yang sudah tersimpan untuk kado kiri
        setActivePopup({ img: leftGiftImg, title: leftGiftText });
      } else {
        // Buka Kado Kiri baru
        const title = isFirstGift 
          ? "Kayanya foto ini pertama kali kita kenal dan deket, juga awal dari kamu kenal yang lainnya" 
          : "Trus ini kita sekarang yang kamu udah terbuka sama kita dan menjadi bagian dari kita.";
        const imgPath = isFirstGift ? "/assets/images/fotoawal.jpg" : "/assets/images/fotoakhir.jpg";
        
        setLeftGiftText(title);
        setLeftGiftImg(imgPath);
        setOpenedGiftsCount(prev => prev + 1);
        setBoomLeft(true);
        setActivePopup({ img: imgPath, title });
      }
    } else {
      if (rightGiftText) {
        // Kalau sudah dibuka, tampilkan lagi data yang sudah tersimpan untuk kado kanan
        setActivePopup({ img: rightGiftImg, title: rightGiftText });
      } else {
        // Buka Kado Kanan baru
        const title = isFirstGift 
          ? "Kayanya foto ini pertama kali kita kenal dan deket, juga awal dari kamu kenal yang lainnya" 
          : "Trus ini kita sekarang yang kamu udah terbuka sama kita dan menjadi bagian dari kita.";
        const imgPath = isFirstGift ? "/assets/images/fotoawal.jpg" : "/assets/images/fotoakhir.jpg";
        
        setRightGiftText(title);
        setRightGiftImg(imgPath);
        setOpenedGiftsCount(prev => prev + 1);
        setBoomRight(true);
        setActivePopup({ img: imgPath, title });
      }
    }
  };

  return (
    <main
      className={`min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center transition-colors duration-1000 ${
        phase === 2 && !isCandleLit && blowCount >= 3
          ? "bg-black"
          : phase === 3
          ? "bg-neutral-950"
          : "bg-neutral-900"
      } text-white font-sans`}
    >
      <audio ref={audioRef} src="/assets/music/dirayakan.mp3" loop />

      <div
        className={`absolute inset-0 transition-opacity duration-[2000ms] pointer-events-none ${
          isCandleLit ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: "radial-gradient(circle at center, rgba(251, 146, 60, 0.15) 0%, transparent 60%)",
        }}
      />

      {showMainConfetti && windowSize.width > 0 && (
        <Confetti width={windowSize.width} height={windowSize.height} recycle={true} style={{ zIndex: 10 }} />
      )}

      {/* ================= POPUP KADO (Landscape Mode) ================= */}
      <AnimatePresence>
        {activePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePopup(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-pointer p-6"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50, rotate: -10 }}
              animate={{ scale: 1, y: 0, rotate: -2 }}
              exit={{ scale: 0.8, opacity: 0, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="bg-white p-4 md:p-5 pb-24 md:pb-28 rounded-xl shadow-2xl max-w-md w-full relative" // Diperlebar jadi max-w-md
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activePopup.img}
                alt="Foto Kado"
                className="w-full h-auto rounded-lg object-cover aspect-[4/3] bg-neutral-200 border border-neutral-200" // Menggunakan aspect-ratio landscape
                onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/600x450/cccccc/000000?text=Foto"; }}
              />
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/80 backdrop-blur-md rounded-xl border border-white/50 shadow-sm text-center">
                <p className="font-serif text-sm md:text-base text-neutral-900 tracking-wide font-semibold leading-relaxed">
                  {activePopup.title}
                </p>
              </div>
              <button 
                onClick={() => setActivePopup(null)}
                className="absolute -top-4 -right-4 bg-rose-500 text-white w-10 h-10 rounded-full font-bold shadow-lg border-2 border-white hover:bg-rose-600 transition-colors"
              >
                X
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        
        {/* ================= FASE 0: KUIS ================= */}
        {phase === 0 && (
          <motion.div
            key="kuis"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 1 }}
            className="w-full flex flex-col items-center justify-center z-10 px-6"
          >
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-3xl md:text-5xl font-light mb-12 tracking-wide text-center"
            >
              Siapa orang yang psikopat, suka boong, kasar, penjudi, pemabok, semuanya lah siapa itu?
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
              {answers.map((ans, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + idx * 0.2 }}
                  onClick={() => handleAnswer(ans)}
                  className="p-6 text-xl bg-transparent border border-white/20 rounded-full hover:bg-white hover:text-black transition-all duration-300"
                >
                  {ans}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ================= FASE 1: 3 TEKS BERURUTAN ================= */}
        {phase === 1 && (
          <div key="teks" className="z-10 text-center w-full flex items-center justify-center min-h-[50vh]">
            <AnimatePresence mode="wait">
              {textPhase === 0 && (
                <motion.h1
                  key="t1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8 }}
                  className="text-4xl md:text-6xl font-serif text-rose-200 font-bold tracking-widest leading-tight absolute"
                >
                  Oke bener, ini kamu.
                </motion.h1>
              )}
              {textPhase === 1 && (
                <motion.h1
                  key="t2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8 }}
                  className="text-4xl md:text-6xl font-serif text-rose-200 font-bold tracking-widest leading-tight absolute"
                >
                  Makasih ya udah mau ngakuin akhirnya..
                </motion.h1>
              )}
              {textPhase === 2 && (
                <motion.h1
                  key="t3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                  transition={{ duration: 0.8 }}
                  className="text-4xl md:text-6xl font-serif text-rose-200 font-bold tracking-widest leading-tight absolute max-w-4xl"
                >
                  Ini mungkin hadiah kecil kecilan terakhir dari aku...
                </motion.h1>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ================= FASE 2: KUE 6 LAYER & KADO ================= */}
        {phase === 2 && (
          <motion.div key="kue" className="relative z-10 flex flex-col items-center h-[75vh] justify-end w-full max-w-4xl px-4">
            <AnimatePresence>
              {isCandleLit && openedGiftsCount < 2 && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-0 text-2xl md:text-3xl font-bold text-rose-200 animate-pulse z-50 text-center"
                >
                  Nih aku kasih kado coba buka man semuanya!!
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isCandleLit && openedGiftsCount === 2 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  onClick={handleBlow}
                  className="absolute top-10 px-10 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold text-xl rounded-full hover:bg-rose-500 hover:border-rose-500 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] z-50"
                >
                  Tiup Lilin! {blowCount > 0 ? `(${blowCount}/3)` : ""}
                </motion.button>
              )}
            </AnimatePresence>

            <div className="flex items-end justify-between w-full relative px-2 md:px-10">
              <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8, type: "spring" }}
                onClick={() => { if(isCandleLit) handleOpenGift("left") }}
                className={`cursor-pointer z-30 relative ${isCandleLit ? "" : "pointer-events-none"}`}
              >
                {boomLeft && <GiftParticles />}
                <CSSGift boxColor="bg-blue-400" isOpened={!!leftGiftText} />
              </motion.div>

              <div className="flex flex-col items-center z-20 mx-auto">
                <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: isCandleLit ? [0.8, 1.2, 0.9] : 0, scale: isCandleLit ? 1 : 0 }} transition={{ duration: 0.5, repeat: isCandleLit ? Infinity : 0, repeatType: "mirror" }} className="w-8 h-12 bg-gradient-to-t from-orange-400 to-yellow-200 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] blur-[2px] mb-2 drop-shadow-[0_0_15px_rgba(251,146,60,0.8)]" />
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 45, opacity: 1 }} transition={{ delay: 3.8, duration: 0.5 }} onAnimationComplete={() => { setIsCandleLit(true); setShowMainConfetti(true); }} className="w-4 bg-red-400 rounded-t-md border-x border-red-500 z-20" />
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 3.4, duration: 0.6, type: "spring" }} className="w-[40vw] max-w-[100px] h-12 bg-pink-100 rounded-t-xl border-b-4 border-pink-200 z-[25] shadow-lg" />
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 3.0, duration: 0.6, type: "spring" }} className="w-[50vw] max-w-[160px] h-12 bg-pink-200 rounded-t-xl border-b-4 border-pink-300 z-[24] shadow-lg -mt-2" />
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 2.6, duration: 0.6, type: "spring" }} className="w-[60vw] max-w-[220px] h-14 bg-pink-300 rounded-t-xl border-b-4 border-pink-400 z-[23] shadow-lg -mt-2" />
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 2.2, duration: 0.6, type: "spring" }} className="w-[70vw] max-w-[280px] h-16 bg-pink-400 rounded-t-xl border-b-4 border-pink-500 z-[22] shadow-lg -mt-2" />
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.8, duration: 0.6, type: "spring" }} className="w-[80vw] max-w-[340px] h-16 bg-rose-400 rounded-t-xl border-b-4 border-rose-500 z-[21] shadow-lg -mt-2" />
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.4, duration: 0.6, type: "spring" }} className="w-[90vw] max-w-[400px] h-20 bg-rose-500 rounded-t-xl shadow-2xl -mt-2" />
              </div>

              <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.8, type: "spring" }}
                onClick={() => { if(isCandleLit) handleOpenGift("right") }}
                className={`cursor-pointer z-30 relative ${isCandleLit ? "" : "pointer-events-none"}`}
              >
                {boomRight && <GiftParticles />}
                <CSSGift boxColor="bg-emerald-400" isOpened={!!rightGiftText} />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ================= FASE 3: HUJAN 7 FOTO (Landscape Mode) & UCAPAN ================= */}
        {phase === 3 && (
          <div key="kejutan" className="relative w-full h-screen overflow-hidden flex items-center justify-center">
            
            {photoRain.map((drop) => (
              <motion.div
                key={`rain-${drop.id}`}
                initial={{ y: "-20vh", opacity: 0, rotate: drop.rotateStart }}
                animate={{ y: "120vh", opacity: [0, 1, 1, 0], rotate: drop.rotateEnd }}
                transition={{ duration: drop.duration, repeat: Infinity, delay: drop.delay, ease: "linear" }}
                // Class di bawah diubah agar frame polaroid-nya melebar (Landscape)
                className="absolute w-32 h-24 md:w-48 md:h-36 bg-white p-2 pb-8 md:p-3 md:pb-12 rounded-sm shadow-xl"
                style={{ left: `${drop.left}%` }}
              >
                <img 
                  src={`/assets/images/foto${drop.picIndex}.jpg`} 
                  alt="Amanda" 
                  className="w-full h-full object-cover bg-neutral-200"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/600x450/cccccc/000000"; }}
                />
              </motion.div>
            ))}

            <AnimatePresence>
              {showFinalText && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ delay: 2, type: "spring", bounce: 0.5, duration: 1.5 }}
                  onClick={() => setShowFinalText(false)} 
                  className="z-50 text-center bg-black/60 p-8 md:p-16 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl cursor-pointer hover:bg-black/70 transition-colors"
                >
                  <h1 className="text-5xl md:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-rose-100 to-pink-500 mb-6 drop-shadow-[0_0_20px_rgba(251,113,133,0.8)]">
                    Sekali Lagi.. <br/> Selamat Ulang Tahun ya man..
                  </h1>
                  <p className="text-lg md:text-2xl text-rose-100/90 font-light max-w-3xl mx-auto italic leading-relaxed">
                    "Semoga kamu bahagia selalu, dan dengan bertambahnya umur ini menjadikan kamu lebih dewasa dari sebelumnya."
                    <br/><br/> Dan yang terpenting jangan lupain kita yaa....
                  </p>
                  
                  <p className="mt-8 text-sm text-white/40 animate-pulse">
                    (Klik pesan ini untuk melihat hujan foto)
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        )}

      </AnimatePresence>
    </main>
  );
}