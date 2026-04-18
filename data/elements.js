// data/elements.js — 元素数据库
window.MSCLab = window.MSCLab || {};

window.MSCLab.elementsData = [
    {
      symbol: "Fe",
      name: { en: "Iron", zh: "\u94c1" },
      atomicNumber: 26,
      atomicWeight: 55.845,
      valence: "+2, +3",
      atomicRadius: 156,
      covalentRadius: 132,
      metallicRadius: 126,
      electronegativity: 1.83,
      crystalStructure: "BCC",
      density: 7.87,
      meltingPoint: 1538,
      notes: {
        en: "Base element for steels; BCC ferrite and FCC austenite transformations dominate many alloy design routes.",
        zh: "\u94a2\u94c1\u6750\u6599\u7684\u57fa\u7840\u5143\u7d20\uff1bBCC \u94c1\u7d20\u4f53\u4e0e FCC \u5965\u6c0f\u4f53\u8f6c\u53d8\u4e3b\u5bfc\u4e86\u8bb8\u591a\u5408\u91d1\u8bbe\u8ba1\u8def\u7ebf\u3002"
      }
    },
    {
      symbol: "Ni",
      name: { en: "Nickel", zh: "\u954d" },
      atomicNumber: 28,
      atomicWeight: 58.693,
      valence: "+2, +3",
      atomicRadius: 149,
      covalentRadius: 124,
      metallicRadius: 124,
      electronegativity: 1.91,
      crystalStructure: "FCC",
      density: 8.90,
      meltingPoint: 1455,
      notes: {
        en: "Key FCC matrix element for superalloys with strong oxidation and corrosion resistance.",
        zh: "\u9ad8\u6e29\u5408\u91d1\u7684\u5173\u952e FCC \u57fa\u4f53\u5143\u7d20\uff0c\u5177\u6709\u826f\u597d\u7684\u6297\u6c27\u5316\u548c\u6297\u8150\u8680\u80fd\u529b\u3002"
      }
    },
    {
      symbol: "Co",
      name: { en: "Cobalt", zh: "\u94b4" },
      atomicNumber: 27,
      atomicWeight: 58.933,
      valence: "+2, +3",
      atomicRadius: 152,
      covalentRadius: 126,
      metallicRadius: 125,
      electronegativity: 1.88,
      crystalStructure: { en: "HCP / FCC", zh: "HCP / FCC" },
      density: 8.90,
      meltingPoint: 1495,
      notes: {
        en: "Used in high-temperature alloys, hardfacing systems, and magnetic materials.",
        zh: "\u5e38\u7528\u4e8e\u9ad8\u6e29\u5408\u91d1\u3001\u5806\u710a\u7cfb\u7edf\u548c\u78c1\u6027\u6750\u6599\u3002"
      }
    },
    {
      symbol: "Cr",
      name: { en: "Chromium", zh: "\u94ec" },
      atomicNumber: 24,
      atomicWeight: 51.996,
      valence: "+2, +3, +6",
      atomicRadius: 166,
      covalentRadius: 139,
      metallicRadius: 128,
      electronegativity: 1.66,
      crystalStructure: "BCC",
      density: 7.19,
      meltingPoint: 1907,
      notes: {
        en: "Improves corrosion resistance and contributes to carbide formation in stainless and tool steels.",
        zh: "\u80fd\u63d0\u5347\u8010\u8680\u8680\u6027\uff0c\u5e76\u5728\u4e0d\u9508\u94a2\u548c\u5de5\u5177\u94a2\u4e2d\u4fc3\u8fdb\u78b3\u5316\u7269\u5f62\u6210\u3002"
      }
    },
    {
      symbol: "Al",
      name: { en: "Aluminum", zh: "\u94dd" },
      atomicNumber: 13,
      atomicWeight: 26.982,
      valence: "+3",
      atomicRadius: 143,
      covalentRadius: 121,
      metallicRadius: 143,
      electronegativity: 1.61,
      crystalStructure: "FCC",
      density: 2.70,
      meltingPoint: 660.3,
      notes: {
        en: "Low-density FCC metal used in structural alloys and as a major element in Ni-based gamma prime systems.",
        zh: "\u4f4e\u5bc6\u5ea6 FCC \u91d1\u5c5e\uff0c\u7528\u4e8e\u7ed3\u6784\u5408\u91d1\uff0c\u4e5f\u662f\u954d\u57fa gamma prime \u7cfb\u7edf\u7684\u91cd\u8981\u5143\u7d20\u3002"
      }
    },
    {
      symbol: "Ti",
      name: { en: "Titanium", zh: "\u949b" },
      atomicNumber: 22,
      atomicWeight: 47.867,
      valence: "+2, +3, +4",
      atomicRadius: 147,
      covalentRadius: 160,
      metallicRadius: 147,
      electronegativity: 1.54,
      crystalStructure: "HCP",
      density: 4.51,
      meltingPoint: 1668,
      notes: {
        en: "Strength-to-weight critical alloying element with alpha-beta transformations and strong affinity for interstitials.",
        zh: "\u5177\u6709\u9ad8\u6bd4\u5f3a\u5ea6\u4f18\u52bf\u7684\u91cd\u8981\u5408\u91d1\u5143\u7d20\uff0c\u5b58\u5728 alpha-beta \u8f6c\u53d8\uff0c\u4e14\u5bf9\u95f4\u9699\u5143\u7d20\u4eb2\u548c\u529b\u5f3a\u3002"
      }
    },
    {
      symbol: "Ta",
      name: { en: "Tantalum", zh: "\u94bd" },
      atomicNumber: 73,
      atomicWeight: 180.948,
      valence: "+5",
      atomicRadius: 200,
      covalentRadius: 170,
      metallicRadius: 146,
      electronegativity: 1.50,
      crystalStructure: "BCC",
      density: 16.69,
      meltingPoint: 3017,
      notes: {
        en: "Dense refractory element used for high-temperature strengthening and creep resistance.",
        zh: "\u9ad8\u5bc6\u5ea6\u96be\u7194\u5143\u7d20\uff0c\u5e38\u7528\u4e8e\u9ad8\u6e29\u5f3a\u5316\u548c\u6297\u87ba\u53d8\u3002"
      }
    },
    {
      symbol: "W",
      name: { en: "Tungsten", zh: "\u94a8" },
      atomicNumber: 74,
      atomicWeight: 183.84,
      valence: "+4, +5, +6",
      atomicRadius: 193,
      covalentRadius: 162,
      metallicRadius: 139,
      electronegativity: 2.36,
      crystalStructure: "BCC",
      density: 19.25,
      meltingPoint: 3422,
      notes: {
        en: "Very high melting point refractory element used for solid-solution and high-temperature strength.",
        zh: "\u5177\u6709\u6781\u9ad8\u7194\u70b9\u7684\u96be\u7194\u5143\u7d20\uff0c\u5e38\u7528\u4e8e\u56fa\u6eb6\u5f3a\u5316\u548c\u9ad8\u6e29\u5f3a\u5ea6\u63d0\u5347\u3002"
      }
    },
    {
      symbol: "Mo",
      name: { en: "Molybdenum", zh: "\u94bc" },
      atomicNumber: 42,
      atomicWeight: 95.95,
      valence: "+4, +6",
      atomicRadius: 190,
      covalentRadius: 154,
      metallicRadius: 139,
      electronegativity: 2.16,
      crystalStructure: "BCC",
      density: 10.28,
      meltingPoint: 2623,
      notes: {
        en: "Common alloying element for creep strength, carbide formation, and solid-solution strengthening.",
        zh: "\u5e38\u89c1\u7684\u5408\u91d1\u5143\u7d20\uff0c\u53ef\u63d0\u5347\u87ba\u53d8\u5f3a\u5ea6\uff0c\u4fc3\u8fdb\u78b3\u5316\u7269\u5f62\u6210\u5e76\u5b9e\u73b0\u56fa\u6eb6\u5f3a\u5316\u3002"
      }
    },
    {
      symbol: "V",
      name: { en: "Vanadium", zh: "\u9492" },
      atomicNumber: 23,
      atomicWeight: 50.942,
      valence: "+2, +3, +4, +5",
      atomicRadius: 171,
      covalentRadius: 153,
      metallicRadius: 134,
      electronegativity: 1.63,
      crystalStructure: "BCC",
      density: 6.11,
      meltingPoint: 1910,
      notes: {
        en: "Forms strong carbides and nitrides; widely used in microalloyed steels.",
        zh: "\u6613\u5f62\u6210\u7a33\u5b9a\u78b3\u5316\u7269\u548c\u6c2e\u5316\u7269\uff0c\u5728\u5fae\u5408\u91d1\u94a2\u4e2d\u5e94\u7528\u5e7f\u6cdb\u3002"
      }
    },
    {
      symbol: "Nb",
      name: { en: "Niobium", zh: "\u94cc" },
      atomicNumber: 41,
      atomicWeight: 92.906,
      valence: "+3, +5",
      atomicRadius: 198,
      covalentRadius: 164,
      metallicRadius: 146,
      electronegativity: 1.60,
      crystalStructure: "BCC",
      density: 8.57,
      meltingPoint: 2477,
      notes: {
        en: "Important in superalloys and microalloyed steels for precipitation and grain-growth control.",
        zh: "\u5728\u9ad8\u6e29\u5408\u91d1\u548c\u5fae\u5408\u91d1\u94a2\u4e2d\u5bf9\u6790\u51fa\u63a7\u5236\u548c\u6291\u5236\u6676\u7c92\u957f\u5927\u975e\u5e38\u91cd\u8981\u3002"
      }
    },
    {
      symbol: "C",
      name: { en: "Carbon", zh: "\u78b3" },
      atomicNumber: 6,
      atomicWeight: 12.011,
      valence: "-4, +2, +4",
      atomicRadius: 70,
      covalentRadius: 76,
      metallicRadius: null,
      electronegativity: 2.55,
      crystalStructure: { en: "Diamond / Graphite", zh: "\u91d1\u521a\u77f3 / \u77f3\u58a8" },
      density: 2.26,
      meltingPoint: 3550,
      notes: {
        en: "Primary interstitial strengthening element in steels and a core constituent of carbides and graphite.",
        zh: "\u94a2\u4e2d\u6700\u5173\u952e\u7684\u95f4\u9699\u5f3a\u5316\u5143\u7d20\uff0c\u4e5f\u662f\u78b3\u5316\u7269\u548c\u77f3\u58a8\u7684\u6838\u5fc3\u7ec4\u6210\u5143\u7d20\u3002"
      }
    },
    {
      symbol: "B",
      name: { en: "Boron", zh: "\u787c" },
      atomicNumber: 5,
      atomicWeight: 10.81,
      valence: "+3",
      atomicRadius: 85,
      covalentRadius: 84,
      metallicRadius: null,
      electronegativity: 2.04,
      crystalStructure: { en: "Rhombohedral", zh: "\u83f1\u65b9" },
      density: 2.34,
      meltingPoint: 2076,
      notes: {
        en: "Often used in ppm levels to improve hardenability and grain-boundary behavior.",
        zh: "\u5e38\u4ee5 ppm \u7ea7\u522b\u6dfb\u52a0\uff0c\u4ee5\u63d0\u9ad8\u6dec\u900f\u6027\u548c\u6676\u754c\u884c\u4e3a\u3002"
      }
    },
    {
      symbol: "N",
      name: { en: "Nitrogen", zh: "\u6c2e" },
      atomicNumber: 7,
      atomicWeight: 14.007,
      valence: "-3, +3, +5",
      atomicRadius: 65,
      covalentRadius: 71,
      metallicRadius: null,
      electronegativity: 3.04,
      crystalStructure: { en: "Molecular gas", zh: "\u5206\u5b50\u6c14\u4f53" },
      density: 0.00125,
      meltingPoint: -210.0,
      notes: {
        en: "Interstitial element that can strongly influence strength, strain aging, and nitride formation.",
        zh: "\u95f4\u9699\u5143\u7d20\uff0c\u5bf9\u5f3a\u5ea6\u3001\u5e94\u53d8\u65f6\u6548\u548c\u6c2e\u5316\u7269\u5f62\u6210\u6709\u663e\u8457\u5f71\u54cd\u3002"
      }
    },
    {
      symbol: "O",
      name: { en: "Oxygen", zh: "\u6c27" },
      atomicNumber: 8,
      atomicWeight: 15.999,
      valence: "-2",
      atomicRadius: 60,
      covalentRadius: 66,
      metallicRadius: null,
      electronegativity: 3.44,
      crystalStructure: { en: "Molecular gas", zh: "\u5206\u5b50\u6c14\u4f53" },
      density: 0.00143,
      meltingPoint: -218.8,
      notes: {
        en: "Controls oxide scale formation and can act as a strong interstitial impurity in reactive alloys.",
        zh: "\u4f1a\u5f71\u54cd\u6c27\u5316\u819c\u5f62\u6210\uff0c\u5728\u6d3b\u6cfc\u5408\u91d1\u4e2d\u4e5f\u53ef\u4f5c\u4e3a\u5f3a\u95f4\u9699\u6742\u8d28\u3002"
      }
    },
    {
      symbol: "Y",
      name: { en: "Yttrium", zh: "\u9487" },
      atomicNumber: 39,
      atomicWeight: 88.906,
      valence: "+3",
      atomicRadius: 212,
      covalentRadius: 190,
      metallicRadius: 180,
      electronegativity: 1.22,
      crystalStructure: "HCP",
      density: 4.47,
      meltingPoint: 1526,
      notes: {
        en: "Used in oxide-dispersion-strengthened alloys and to improve oxide-scale adhesion.",
        zh: "\u5e38\u7528\u4e8e\u6c27\u5316\u7269\u5f25\u6563\u5f3a\u5316\u5408\u91d1\uff0c\u5e76\u53ef\u6539\u5584\u6c27\u5316\u819c\u9644\u7740\u6027\u3002"
      }
    },
    {
      symbol: "Zr",
      name: { en: "Zirconium", zh: "\u9511" },
      atomicNumber: 40,
      atomicWeight: 91.224,
      valence: "+4",
      atomicRadius: 206,
      covalentRadius: 175,
      metallicRadius: 160,
      electronegativity: 1.33,
      crystalStructure: "HCP",
      density: 6.52,
      meltingPoint: 1855,
      notes: {
        en: "Common in nuclear materials and strong carbide/nitride former in advanced alloys.",
        zh: "\u5728\u6838\u6750\u6599\u4e2d\u5e38\u89c1\uff0c\u4e14\u5728\u5148\u8fdb\u5408\u91d1\u4e2d\u662f\u5f3a\u78b3\u5316\u7269/\u6c2e\u5316\u7269\u5f62\u6210\u5143\u7d20\u3002"
      }
    },
    {
      symbol: "Si",
      name: { en: "Silicon", zh: "\u7845" },
      atomicNumber: 14,
      atomicWeight: 28.085,
      valence: "-4, +4",
      atomicRadius: 111,
      covalentRadius: 111,
      metallicRadius: null,
      electronegativity: 1.90,
      crystalStructure: { en: "Diamond cubic", zh: "\u91d1\u521a\u77f3\u7acb\u65b9" },
      density: 2.33,
      meltingPoint: 1414,
      notes: {
        en: "Widely used in cast alloys, oxidation-resistant systems, and semiconductor materials.",
        zh: "\u5e7f\u6cdb\u7528\u4e8e\u94f8\u9020\u5408\u91d1\u3001\u6297\u6c27\u5316\u4f53\u7cfb\u548c\u534a\u5bfc\u4f53\u6750\u6599\u3002"
      }
    }
  ];
