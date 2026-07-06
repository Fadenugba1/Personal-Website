/* ============================================================
   SITE DATA — edit this file to update the website.
   Everything on the page (links, work, projects) renders
   from this object. No other file needs touching.
   ============================================================ */

const SITE = {
  name: ["Folabomi", "Adenugba"],
  tagline: "Student building machine learning systems and quantitative trading strategies.",
  status: "Always looking for new opportunities",
  location: "Southampton, UK",
  email: "folabomiadenugba@gmail.com",

  currently: {
    role: "Student",
    org: "University of Southampton",
    orgUrl: null, // e.g. "https://www.southampton.ac.uk/"
    dates: "Present",
    focus: ["Machine Learning", "Quantitative Finance"],
  },

  /* ----------------------------------------------------------
     LINKS — add as many as you like; they render in the footer
     "Elsewhere" section. Shape: { label, handle, url }
     ---------------------------------------------------------- */
  links: [
    {
      label: "GitHub",
      handle: "@Fadenugba1",
      url: "https://github.com/Fadenugba1",
    },
    {
      label: "LinkedIn",
      handle: "folabomi-adenugba",
      url: "https://www.linkedin.com/in/folabomi-adenugba-23912a283/",
    },
    // { label: "X (Twitter)", handle: "@yourhandle", url: "https://x.com/yourhandle" },
    // { label: "Email", handle: "folabomiadenugba@gmail.com", url: "mailto:folabomiadenugba@gmail.com" },
  ],

  /* ----------------------------------------------------------
     SELECTED WORK — experience, newest first.
     Shape: { year, org, role, description, tags: [], url }
     ---------------------------------------------------------- */
  workHeading: "Selected Work",
  work: [
    {
      year: "2026",
      org: "IMC Prosperity 4",
      role: "Algorithmic Trader",
      description:
        "Competed in IMC's global algorithmic trading competition — designed, backtested and iterated on market-making and arbitrage strategies across simulated products.",
      tags: ["Quantitative Trading", "Python", "Backtesting"],
      url: "https://prosperity.imc.com/",
    },
    // {
    //   year: "2025",
    //   org: "Company Name",
    //   role: "Software Engineering Intern",
    //   description: "What you did and what you learned.",
    //   tags: ["Python", "AWS"],
    //   url: null,
    // },
  ],

  /* ----------------------------------------------------------
     FEATURED PROJECTS — newest / best first.
     Shape: { title, description, tags: [], url }
     ---------------------------------------------------------- */
  projects: [
    {
      title: "ReAct Agent from Scratch",
      description:
        "Implementation of the ReAct agent architecture (Reasoning + Acting) from the original paper (arXiv:2210.03629) — an LLM agent that interleaves chain-of-thought reasoning with tool use.",
      tags: ["AI", "LLM Agents", "Python"],
      url: "https://github.com/Fadenugba1/ReAct-Agent-from-scratch",
    },
    {
      title: "Attention Is All You Need",
      description:
        "From-scratch implementation of the Transformer architecture from the landmark paper — multi-head attention, positional encodings and the full encoder–decoder stack.",
      tags: ["Deep Learning", "Transformers", "PyTorch"],
      url: "https://github.com/Fadenugba1/Attention-is-All-you-Need",
    },
    {
      title: "Algorithmic Trading Strategy",
      description:
        "Research notebook developing and evaluating a systematic trading strategy — signal generation, backtesting and performance analysis.",
      tags: ["Quantitative Finance", "Python"],
      url: "https://github.com/Fadenugba1/Algo-trading-strategy",
    },
    {
      title: "Image Classifier",
      description:
        "Convolutional neural network image classification pipeline — data augmentation, training and evaluation.",
      tags: ["Computer Vision", "Deep Learning"],
      url: "https://github.com/Fadenugba1/Image-Classifier-",
    },
  ],

  connect: {
    heading: "Let's Connect",
    blurb:
      "Always interested in new opportunities, collaborations, and conversations about technology, markets and machine learning.",
    cta: "Send me a message",
  },
};
