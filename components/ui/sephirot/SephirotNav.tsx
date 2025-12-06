"use client";

import dynamic from "next/dynamic";
import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import "./styles.css";

const Tree = dynamic(
  async () => {
    const mod = await import("react-d3-tree");
    return mod.default;
  },
  { ssr: false },
);

type NodeAttributes = {
  section: string;
  route?: string;
};

type Node = {
  name: string;
  attributes: NodeAttributes;
  children?: Node[];
};

const data: Node = {
  name: "Kether",
  attributes: { section: "Accueil / Forum global", route: "/" },
  children: [
    {
      name: "Chokhmah",
      attributes: { section: "IA & Prédictions", route: "/ia" },
    },
    {
      name: "Binah",
      attributes: { section: "Politique & Vision", route: "/politique" },
    },
    {
      name: "Chesed",
      attributes: { section: "Terminal KBL", route: "/terminal" },
    },
    {
      name: "Gevurah",
      attributes: { section: "Outils & Code", route: "/terminal" },
    },
    {
      name: "Tipheret",
      attributes: { section: "Audio / Visuel", route: "/audiovisuel" },
    },
    {
      name: "Netzach",
      attributes: { section: "Trading & Stratégies", route: "/terminal" },
    },
    {
      name: "Hod",
      attributes: { section: "Sciences & Social", route: "/politique" },
    },
    {
      name: "Yesod",
      attributes: { section: "Communauté", route: "/communautes" },
    },
    {
      name: "Malkuth",
      attributes: {
        section: "Monétisation & Ressources",
        route: "/communautes",
      },
    },
  ],
};

export function SephirotNav() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeNodeName, setActiveNodeName] = useState<string | null>(null);

  const handleClick = useCallback(
    (node: any) => {
      const section = node.data.attributes?.section as string | undefined;
      const name = node.data.name as string | undefined;
      const route = node.data.attributes?.route as string | undefined;

      setActiveSection(section ?? null);
      setActiveNodeName(name ?? null);

      if (route) {
        router.push(route);
      }
      console.log("Clicked:", name, section, route);
    },
    [router],
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full"
    >
      <Card className="w-full h-[70vh] bg-gradient-to-br from-slate-950/90 via-slate-900/90 to-slate-950/90 backdrop-blur-3xl border border-slate-700/50 shadow-2xl shadow-blue-500/10 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 overflow-hidden">
        <div className="w-full h-full px-6 pt-8 flex flex-col gap-6">
          <motion.div
            className="flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="tree-container w-full h-full">
              <Tree
                data={data as any}
                orientation="vertical"
                translate={{ x: 420, y: 60 }}
                zoom={1.15}
                pathFunc="step"
                separation={{ siblings: 1.4, nonSiblings: 1.7 }}
                onNodeClick={handleClick}
              />
            </div>
          </motion.div>

          <motion.div
            className="h-20 rounded-2xl bg-slate-900/90 border border-slate-700/60 px-5 flex items-center backdrop-blur-xl"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 80, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {activeSection ? (
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Section active
                </p>
                <p className="text-sm text-slate-200">
                  <span className="font-bold text-blue-400">
                    {activeNodeName}
                  </span>{" "}
                  — <span className="text-slate-300">{activeSection}</span>
                </p>
              </div>
            ) : (
              <motion.p
                className="text-sm text-slate-400"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                Clique sur une sphère pour activer un univers de KBL CENTER…
              </motion.p>
            )}
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}
