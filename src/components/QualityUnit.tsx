'use client';

import { Eye, Target, Flag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const qualityCards = [
  {
    id: "vision",
    icon: Eye,
    title: "Our Vision",
    content:
      "The Quality Assurance Unit seeks to achieve excellence and leadership in higher education through the application of comprehensive quality standards and academic accreditation, and to improve the level of institutional and academic performance in accordance with local and global standards.",
  },
  {
    id: "mission",
    icon: Target,
    title: "Our Mission",
    content:
      "The Quality Assurance Unit is committed to spreading the culture of quality and applying academic accreditation standards, developing the educational and research process, and community service, through continuous evaluation of performance and improving the quality of educational outcomes to meet the needs of the labor market.",
  },
  {
    id: "goals",
    icon: Flag,
    title: "Our Goals",
    content: null,
    list: [
      "Spreading the culture of quality among all staff and students",
      "Applying local and global academic accreditation standards",
      "Developing academic programs in line with labor market requirements",
      "Improving the level of institutional and academic performance",
      "Enhancing community participation and serving the surrounding environment",
    ],
  },
];

const QualityUnit = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="py-16 md:py-20 bg-secondary/30 dark:bg-zinc-900" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <motion.div
          className="text-center mb-12"
          variants={titleVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <h2 className="section-title text-primary dark:text-blue-400">Quality Assurance Unit</h2>
          <div className="w-16 h-1 bg-primary dark:bg-blue-400 mx-auto mt-3 rounded-full" />
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {qualityCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.article
                key={card.id}
                className="card-academic p-6 relative overflow-hidden group bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.03,
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(44, 62, 124, 0.15), 0 10px 10px -5px rgba(44, 62, 124, 0.1)"
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Animated background overlay */}
                <div className="absolute inset-0 bg-primary dark:bg-blue-600 origin-bottom-right z-0 scale-0 group-hover:scale-100 transition-transform duration-400 ease-out" />
                
                {/* Decorative background icon */}
                <motion.div
                  className="absolute -right-6 -bottom-6 w-32 h-32 text-primary/5 group-hover:text-white/10 z-1"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon className="w-full h-full" />
                </motion.div>

                <div className="relative z-10">
                  <motion.div
                    className="flex items-center gap-3 mb-4"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className="w-1 h-8 bg-primary dark:bg-blue-400 rounded-full group-hover:bg-white"
                      whileHover={{ scaleY: 1.2 }}
                      transition={{ duration: 0.2 }}
                    />
                    <h3 className="text-xl font-bold text-foreground dark:text-white group-hover:text-white">{card.title}</h3>
                  </motion.div>

                  {card.content && (
                    <motion.p
                      className="text-muted-foreground dark:text-zinc-300 text-sm leading-relaxed group-hover:text-white/90"
                      initial={{ opacity: 0.9 }}
                      whileHover={{ opacity: 1 }}
                    >
                      {card.content}
                    </motion.p>
                  )}

                  {card.list && (
                    <ul className="space-y-2">
                      {card.list.map((item, idx) => (
                        <motion.li
                          key={idx}
                          className="text-muted-foreground text-sm flex items-start gap-2 group-hover:text-white/90"
                          initial={{ opacity: 0.9, x: 0 }}
                          whileHover={{ opacity: 1, x: 3 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0 group-hover:bg-white" />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        {/* Read More Link */}
        <motion.div
          className="flex justify-start"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all group"
          >
            <motion.div
              className="w-1 h-6 bg-primary rounded-full"
              whileHover={{ scaleY: 1.3 }}
              transition={{ duration: 0.2 }}
            />
            Read More About Quality Assurance Unit
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut" as const,
              }}
            >
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default QualityUnit;
