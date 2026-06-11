'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Target,
  Plus,
  Trash2,
  FileText,
  Compass,
  Megaphone,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Globe,
} from 'lucide-react';

interface GoalItem {
  id?: number | string;
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
  linkText_en: string;
  linkText_hi: string;
}

interface ActionStep {
  id?: number | string;
  number: string;
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
}

interface CallToAction {
  id?: number | string;
  buttonText_en: string;
  buttonText_hi: string;
}

interface GoalsData {
  // Hero section
  heroHeading_en: string;
  heroHeading_hi: string;
  heroDescription_en: string;
  heroDescription_hi: string;

  // Goals section main header
  goalsHeading_en: string;
  goalsHeading_hi: string;
  goalsSubtitle_en: string;
  goalsSubtitle_hi: string;

  // Goals list
  goals: GoalItem[];

  // Tagline (under Goals)
  tagline_en: string;
  tagline_hi: string;
  taglineDescription_en: string;
  taglineDescription_hi: string;

  // Strategy section main header
  strategyHeading_en: string;
  strategyHeading_hi: string;
  strategySubheading_en: string;
  strategySubheading_hi: string;
  strategyDescription_en: string;
  strategyDescription_hi: string;

  // Action steps list
  actionSteps: ActionStep[];

  // CTA section main header
  ctaHeading_en: string;
  ctaHeading_hi: string;
  ctaDescription_en: string;
  ctaDescription_hi: string;

  // CTA buttons list
  ctaButtons: CallToAction[];
}

type TabType = 'hero' | 'goals' | 'strategy' | 'cta';

const API_BASE = `http://${process.env.NEXT_PUBLIC_URL || 'localhost:4000'}/goals`;

// High-fidelity fallback data in case backend fails
const FALLBACK_DATA: GoalsData = {
  heroHeading_en: 'Our Goals',
  heroHeading_hi: 'हमारे लक्ष्य',
  heroDescription_en:
    'Defining our long-term vision of excellence in education, research, and societal growth through innovation, sustainability, and inclusive development.',
  heroDescription_hi:
    'नवाचार, स्थिरता और समावेशी विकास के माध्यम से शिक्षा, अनुसंधान और सामाजिक विकास में उत्कृष्टता के हमारे दीर्घकालिक दृष्टिकोण को परिभाषित करना।',

  goalsHeading_en: 'Institutional Goals',
  goalsHeading_hi: 'संस्थागत लक्ष्य',
  goalsSubtitle_en:
    'Eight pillars driving our commitment to excellence, innovation, and sustainable growth',
  goalsSubtitle_hi:
    'उत्कृष्टता, नवाचार और सतत विकास के प्रति हमारी प्रतिबद्धता को चलाने वाले आठ स्तंभ',

  goals: [
    {
      id: 1,
      title_en: 'Academic Excellence',
      title_hi: 'शैक्षणिक उत्कृष्टता',
      description_en:
        'Deliver world-class education with a dynamic curriculum designed for future global leaders.',
      description_hi:
        'भविष्य के वैश्विक नेताओं के लिए डिज़ाइन किए गए गतिशील पाठ्यक्रम के साथ विश्व स्तरीय शिक्षा प्रदान करना।',
      linkText_en: 'Read Curriculum Plan',
      linkText_hi: 'पाठ्यक्रम योजना पढ़ें',
    },
    {
      id: 2,
      title_en: 'Research & Innovation',
      title_hi: 'अनुसंधान और नवाचार',
      description_en:
        'Foster pioneering research that addresses complex real-world challenges and technological shifts.',
      description_hi:
        'जटिल वास्तविक दुनिया की चुनौतियों और तकनीकी बदलावों को संबोधित करने वाले अग्रणी अनुसंधान को बढ़ावा देना।',
      linkText_en: 'Explore Research Centers',
      linkText_hi: 'अनुसंधान केंद्रों का अन्वेषण करें',
    },
  ],

  tagline_en: '“Shaping the Future, Empowering Minds”',
  tagline_hi: '“भविष्य को आकार देना, दिमागों को सशक्त बनाना”',
  taglineDescription_en:
    'Every initiative we undertake is aimed at creating a positive, lasting impact on our students and the global community.',
  taglineDescription_hi:
    'हमारे द्वारा की जाने वाली प्रत्येक पहल का उद्देश्य हमारे छात्रों और वैश्विक समुदाय पर सकारात्मक, स्थायी प्रभाव डालना है।',

  strategyHeading_en: 'Strategic Road Map',
  strategyHeading_hi: 'रणनीतिक रोड मैप',
  strategySubheading_en: 'How We Achieve Our Goals',
  strategySubheading_hi: 'हम अपने लक्ष्यों को कैसे प्राप्त करते हैं',
  strategyDescription_en:
    'Our strategy relies on collaborative governance, rigorous academic standards, and state-of-the-art infrastructure to convert goals into achievements.',
  strategyDescription_hi:
    'हमारी रणनीति लक्ष्यों को उपलब्धियों में बदलने के लिए सहयोगी शासन, कठोर शैक्षणिक मानकों और अत्याधुनिक बुनियादी ढांचे पर निर्भर करती।',

  actionSteps: [
    {
      id: 1,
      number: '01',
      title_en: 'Curriculum Revamp',
      title_hi: 'पाठ्यक्रम में बदलाव',
      description_en:
        'Aligning course modules with international accreditation benchmarks.',
      description_hi:
        'अंतरराष्ट्रीय मान्यता बेंचमार्क के साथ पाठ्यक्रम मॉड्यूल का संरेखण।',
    },
    {
      id: 2,
      number: '02',
      title_en: 'Industry Alliances',
      title_hi: 'उद्योग गठबंधन',
      description_en:
        'Establishing key partnerships with industry leaders for internships and knowledge transfer.',
      description_hi:
        'इंटर्नशिप और ज्ञान हस्तांतरण के लिए उद्योग जगत के नेताओं के साथ प्रमुख भागीदारी स्थापित करना।',
    },
  ],

  ctaHeading_en: 'Ready to Join Our Vision?',
  ctaHeading_hi: 'क्या आप हमारे दृष्टिकोण में शामिल होने के लिए तैयार हैं?',
  ctaDescription_en:
    'Partner with us, apply for admissions, or explore research opportunities to contribute to our institutional milestones.',
  ctaDescription_hi:
    'हमारे संस्थागत मील के पत्थर में योगदान करने के लिए हमारे साथ साझेदारी करें, प्रवेश के लिए आवेदन करें, या अनुसंधान के अवसरों का पता लगाएं।',

  ctaButtons: [
    { id: 1, buttonText_en: 'Apply Online', buttonText_hi: 'ऑनलाइन आवेदन करें' },
    { id: 2, buttonText_en: 'Partner With Us', buttonText_hi: 'हमारे साथ भागीदार बनें' },
  ],
};

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'warning';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // High fidelity tracking matching History Page
  const [savingSide, setSavingSide] = useState<{ side: 'en' | 'hi' | 'all' | string | null; section: string | null }>({
    side: null,
    section: null,
  });
  
  const [goalsData, setGoalsData] = useState<GoalsData>(FALLBACK_DATA);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

  // Add Item states
  const [newGoal, setNewGoal] = useState<Omit<GoalItem, 'id'>>({
    title_en: '',
    title_hi: '',
    description_en: '',
    description_hi: '',
    linkText_en: '',
    linkText_hi: '',
  });

  const [newActionStep, setNewActionStep] = useState<Omit<ActionStep, 'id'>>({
    number: '',
    title_en: '',
    title_hi: '',
    description_en: '',
    description_hi: '',
  });

  const [newCtaButton, setNewCtaButton] = useState<Omit<CallToAction, 'id'>>({
    buttonText_en: '',
    buttonText_hi: '',
  });

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  const fetchGoalsData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_BASE);
      if (!response.ok) {
        throw new Error(`Server status: ${response.status}`);
      }
      const data = await response.json();

      const mappedData: GoalsData = {
        heroHeading_en: data.hero_heading_en || data.heroHeading_en || '',
        heroHeading_hi: data.hero_heading_hi || data.heroHeading_hi || '',
        heroDescription_en: data.hero_description_en || data.heroDescription_en || '',
        heroDescription_hi: data.hero_description_hi || data.heroDescription_hi || '',

        goalsHeading_en: data.goals_heading_en || data.goalsHeading_en || '',
        goalsHeading_hi: data.goals_heading_hi || data.goalsHeading_hi || '',
        goalsSubtitle_en: data.goals_subtitle_en || data.goalsSubtitle_en || '',
        goalsSubtitle_hi: data.goals_subtitle_hi || data.goalsSubtitle_hi || '',

        tagline_en: data.tagline_en || '',
        tagline_hi: data.tagline_hi || '',
        taglineDescription_en: data.tagline_description_en || data.taglineDescription_en || '',
        taglineDescription_hi: data.tagline_description_hi || data.taglineDescription_hi || '',

        strategyHeading_en: data.strategy_heading_en || data.strategyHeading_en || '',
        strategyHeading_hi: data.strategy_heading_hi || data.strategyHeading_hi || '',
        strategySubheading_en: data.strategy_subheading_en || data.strategySubheading_en || '',
        strategySubheading_hi: data.strategy_subheading_hi || data.strategySubheading_hi || '',
        strategyDescription_en: data.strategy_description_en || data.strategyDescription_en || '',
        strategyDescription_hi: data.strategy_description_hi || data.strategyDescription_hi || '',

        ctaHeading_en: data.cta_heading_en || data.ctaHeading_en || '',
        ctaHeading_hi: data.cta_heading_hi || data.ctaHeading_hi || '',
        ctaDescription_en: data.cta_description_en || data.ctaDescription_en || '',
        ctaDescription_hi: data.cta_description_hi || data.ctaDescription_hi || '',

        goals: (data.goals || []).map((g: any) => ({
          id: g.id,
          title_en: g.title_en || '',
          title_hi: g.title_hi || '',
          description_en: g.description_en || '',
          description_hi: g.description_hi || '',
          linkText_en: g.linkText_en || g.link_text_en || '',
          linkText_hi: g.linkText_hi || g.link_text_hi || '',
        })),

        actionSteps: (data.actionSteps || []).map((a: any) => ({
          id: a.id,
          number: a.number || '',
          title_en: a.title_en || '',
          title_hi: a.title_hi || '',
          description_en: a.description_en || '',
          description_hi: a.description_hi || '',
        })),

        ctaButtons: (data.ctaButtons || []).map((b: any) => ({
          id: b.id,
          buttonText_en: b.buttonText_en || b.button_text_en || '',
          buttonText_hi: b.buttonText_hi || b.button_text_hi || '',
        })),
      };

      setGoalsData(mappedData);
      showToast('Successfully synchronized backend data!', 'success');
    } catch (error) {
      console.warn('Backend sync failed, using mock fallbacks.', error);
      setGoalsData(FALLBACK_DATA);
      showToast('Using local offline fallback dataset.', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoalsData();
  }, []);

  const saveMainSectionFields = async (side: 'en' | 'hi', sectionKey: string, payload: Record<string, any>) => {
    setSavingSide({ side, section: sectionKey });
    try {
      const response = await fetch(API_BASE, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Database server query failed');
      showToast(`Successfully saved ${side === 'en' ? 'English' : 'Hindi'} values!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Database server offline. Applied updates locally.', 'warning');
    } finally {
      setSavingSide({ side: null, section: null });
    }
  };

  // Dedicated Save buttons per side/language matching History layout specifications
  const handleSaveHero = (side: 'en' | 'hi') => {
    const payload = side === 'en'
      ? { hero_heading_en: goalsData.heroHeading_en, hero_description_en: goalsData.heroDescription_en }
      : { hero_heading_hi: goalsData.heroHeading_hi, hero_description_hi: goalsData.heroDescription_hi };
    saveMainSectionFields(side, 'hero', payload);
  };

  const handleSaveGoalsHeading = (side: 'en' | 'hi') => {
    const payload = side === 'en'
      ? { goals_heading_en: goalsData.goalsHeading_en, goals_subtitle_en: goalsData.goalsSubtitle_en }
      : { goals_heading_hi: goalsData.goalsHeading_hi, goals_subtitle_hi: goalsData.goalsSubtitle_hi };
    saveMainSectionFields(side, 'goalsHeading', payload);
  };

  const handleSaveTagline = (side: 'en' | 'hi') => {
    const payload = side === 'en'
      ? { tagline_en: goalsData.tagline_en, tagline_description_en: goalsData.taglineDescription_en }
      : { tagline_hi: goalsData.tagline_hi, tagline_description_hi: goalsData.taglineDescription_hi };
    saveMainSectionFields(side, 'tagline', payload);
  };

  const handleSaveStrategyHeading = (side: 'en' | 'hi') => {
    const payload = side === 'en'
      ? {
          strategy_heading_en: goalsData.strategyHeading_en,
          strategy_subheading_en: goalsData.strategySubheading_en,
          strategy_description_en: goalsData.strategyDescription_en,
        }
      : {
          strategy_heading_hi: goalsData.strategyHeading_hi,
          strategy_subheading_hi: goalsData.strategySubheading_hi,
          strategy_description_hi: goalsData.strategyDescription_hi,
        };
    saveMainSectionFields(side, 'strategyHeading', payload);
  };

  const handleSaveCtaHeading = (side: 'en' | 'hi') => {
    const payload = side === 'en'
      ? { cta_heading_en: goalsData.ctaHeading_en, cta_description_en: goalsData.ctaDescription_en }
      : { cta_heading_hi: goalsData.ctaHeading_hi, cta_description_hi: goalsData.ctaDescription_hi };
    saveMainSectionFields(side, 'ctaHeading', payload);
  };

  // ============================================
  // GOALS SUB-ITEMS
  // ============================================
  const handleAddGoalItem = async () => {
    if (!newGoal.title_en && !newGoal.title_hi) {
      showToast('Please specify a title in English or Hindi', 'error');
      return;
    }
    setSavingSide({ side: 'all', section: 'addGoal' });
    try {
      const payload = {
        title_en: newGoal.title_en,
        title_hi: newGoal.title_hi,
        description_en: newGoal.description_en,
        description_hi: newGoal.description_hi,
        link_text_en: newGoal.linkText_en,
        link_text_hi: newGoal.linkText_hi,
      };

      const response = await fetch(`${API_BASE}/goal-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error();
      const added = await response.json();
      setGoalsData((prev) => ({
        ...prev,
        goals: [...prev.goals, { ...added, linkText_en: added.link_text_en || '', linkText_hi: added.link_text_hi || '' }],
      }));
      setNewGoal({ title_en: '', title_hi: '', description_en: '', description_hi: '', linkText_en: '', linkText_hi: '' });
      showToast('Successfully inserted Goal item!', 'success');
    } catch (err) {
      const mockId = `temp-${Date.now()}`;
      setGoalsData((prev) => ({ ...prev, goals: [...prev.goals, { id: mockId, ...newGoal }] }));
      setNewGoal({ title_en: '', title_hi: '', description_en: '', description_hi: '', linkText_en: '', linkText_hi: '' });
      showToast('Offline fallback: Added item locally', 'warning');
    } finally {
      setSavingSide({ side: null, section: null });
    }
  };

  const handleUpdateGoalItem = async (id: number | string, index: number, side: 'en' | 'hi') => {
    setSavingSide({ side, section: `goal-${id}` });
    const item = goalsData.goals[index];
    try {
      if (typeof id === 'string' && id.startsWith('temp-')) throw new Error();
      const payload = side === 'en'
        ? { title_en: item.title_en, description_en: item.description_en, link_text_en: item.linkText_en }
        : { title_hi: item.title_hi, description_hi: item.description_hi, link_text_hi: item.linkText_hi };

      const response = await fetch(`${API_BASE}/goal-item/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error();
      showToast(`Successfully saved ${side === 'en' ? 'English' : 'Hindi'} details of Goal #${index + 1}!`, 'success');
    } catch (err) {
      showToast('Applied offline updates locally', 'warning');
    } finally {
      setSavingSide({ side: null, section: null });
    }
  };

  const handleDeleteGoalItem = async (id: number | string, index: number) => {
    setSavingSide({ side: 'all', section: `delete-goal-${id}` });
    try {
      if (typeof id === 'string' && id.startsWith('temp-')) throw new Error();
      const response = await fetch(`${API_BASE}/goal-item/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error();
      setGoalsData((prev) => ({ ...prev, goals: prev.goals.filter((_, idx) => idx !== index) }));
      showToast('Deleted goal item from server', 'success');
    } catch (err) {
      setGoalsData((prev) => ({ ...prev, goals: prev.goals.filter((_, idx) => idx !== index) }));
      showToast('Removed item locally', 'warning');
    } finally {
      setSavingSide({ side: null, section: null });
    }
  };

  // ============================================
  // ACTION STEPS SUB-ITEMS
  // ============================================
  const handleAddActionStep = async () => {
    if (!newActionStep.title_en && !newActionStep.title_hi) {
      showToast('Please specify a title in English or Hindi', 'error');
      return;
    }
    setSavingSide({ side: 'all', section: 'addActionStep' });
    try {
      const payload = {
        number: newActionStep.number,
        title_en: newActionStep.title_en,
        title_hi: newActionStep.title_hi,
        description_en: newActionStep.description_en,
        description_hi: newActionStep.description_hi,
      };

      const response = await fetch(`${API_BASE}/action-step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error();
      const added = await response.json();
      setGoalsData((prev) => ({ ...prev, actionSteps: [...prev.actionSteps, added] }));
      setNewActionStep({ number: '', title_en: '', title_hi: '', description_en: '', description_hi: '' });
      showToast('Successfully inserted action milestone!', 'success');
    } catch (err) {
      const mockId = `temp-${Date.now()}`;
      setGoalsData((prev) => ({ ...prev, actionSteps: [...prev.actionSteps, { id: mockId, ...newActionStep }] }));
      setNewActionStep({ number: '', title_en: '', title_hi: '', description_en: '', description_hi: '' });
      showToast('Offline fallback: Added step locally', 'warning');
    } finally {
      setSavingSide({ side: null, section: null });
    }
  };

  const handleUpdateActionStep = async (id: number | string, index: number, side: 'en' | 'hi') => {
    setSavingSide({ side, section: `step-${id}` });
    const item = goalsData.actionSteps[index];
    try {
      if (typeof id === 'string' && id.startsWith('temp-')) throw new Error();
      const payload = side === 'en'
        ? { number: item.number, title_en: item.title_en, description_en: item.description_en }
        : { number: item.number, title_hi: item.title_hi, description_hi: item.description_hi };

      const response = await fetch(`${API_BASE}/action-step/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error();
      showToast(`Successfully saved ${side === 'en' ? 'English' : 'Hindi'} details of Step #${item.number}!`, 'success');
    } catch (err) {
      showToast('Applied offline updates locally', 'warning');
    } finally {
      setSavingSide({ side: null, section: null });
    }
  };

  const handleDeleteActionStep = async (id: number | string, index: number) => {
    setSavingSide({ side: 'all', section: `delete-step-${id}` });
    try {
      if (typeof id === 'string' && id.startsWith('temp-')) throw new Error();
      const response = await fetch(`${API_BASE}/action-step/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error();
      setGoalsData((prev) => ({ ...prev, actionSteps: prev.actionSteps.filter((_, idx) => idx !== index) }));
      showToast('Deleted milestone step from server', 'success');
    } catch (err) {
      setGoalsData((prev) => ({ ...prev, actionSteps: prev.actionSteps.filter((_, idx) => idx !== index) }));
      showToast('Removed step locally', 'warning');
    } finally {
      setSavingSide({ side: null, section: null });
    }
  };

  // ============================================
  // CTA BUTTONS SUB-ITEMS
  // ============================================
  const handleAddCtaButton = async () => {
    if (!newCtaButton.buttonText_en && !newCtaButton.buttonText_hi) {
      showToast('Please specify a label', 'error');
      return;
    }
    setSavingSide({ side: 'all', section: 'addCtaButton' });
    try {
      const payload = {
        buttonText_en: newCtaButton.buttonText_en,
        buttonText_hi: newCtaButton.buttonText_hi,
      };

      const response = await fetch(`${API_BASE}/cta-button`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error();
      const added = await response.json();
      setGoalsData((prev) => ({
        ...prev,
        ctaButtons: [...prev.ctaButtons, { id: added.id, buttonText_en: added.buttonText_en || added.button_text_en || '', buttonText_hi: added.buttonText_hi || added.button_text_hi || '' }],
      }));
      setNewCtaButton({ buttonText_en: '', buttonText_hi: '' });
      showToast('Successfully added interactive CTA button!', 'success');
    } catch (err) {
      const mockId = `temp-${Date.now()}`;
      setGoalsData((prev) => ({ ...prev, ctaButtons: [...prev.ctaButtons, { id: mockId, ...newCtaButton }] }));
      setNewCtaButton({ buttonText_en: '', buttonText_hi: '' });
      showToast('Offline fallback: Added button locally', 'warning');
    } finally {
      setSavingSide({ side: null, section: null });
    }
  };

  const handleUpdateCtaButton = async (id: number | string, index: number, side: 'en' | 'hi') => {
    setSavingSide({ side, section: `btn-${id}` });
    const item = goalsData.ctaButtons[index];
    try {
      if (typeof id === 'string' && id.startsWith('temp-')) throw new Error();
      const payload = side === 'en'
        ? { buttonText_en: item.buttonText_en }
        : { buttonText_hi: item.buttonText_hi };

      const response = await fetch(`${API_BASE}/cta-button/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error();
      showToast(`Successfully saved ${side === 'en' ? 'English' : 'Hindi'} label of Button #${index + 1}!`, 'success');
    } catch (err) {
      showToast('Applied offline updates locally', 'warning');
    } finally {
      setSavingSide({ side: null, section: null });
    }
  };

  const handleDeleteCtaButton = async (id: number | string, index: number) => {
    setSavingSide({ side: 'all', section: `delete-btn-${id}` });
    try {
      if (typeof id === 'string' && id.startsWith('temp-')) throw new Error();
      const response = await fetch(`${API_BASE}/cta-button/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error();
      setGoalsData((prev) => ({ ...prev, ctaButtons: prev.ctaButtons.filter((_, idx) => idx !== index) }));
      showToast('Removed interactive CTA button', 'success');
    } catch (err) {
      setGoalsData((prev) => ({ ...prev, ctaButtons: prev.ctaButtons.filter((_, idx) => idx !== index) }));
      showToast('Removed button locally', 'warning');
    } finally {
      setSavingSide({ side: null, section: null });
    }
  };

  // State update callbacks
  const handleMainChange = (key: keyof GoalsData, value: any) => {
    setGoalsData((prev) => ({ ...prev, [key]: value }));
  };

  const handleGoalItemChange = (index: number, key: keyof GoalItem, value: string) => {
    setGoalsData((prev) => {
      const updated = [...prev.goals];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, goals: updated };
    });
  };

  const handleActionStepChange = (index: number, key: keyof ActionStep, value: string) => {
    setGoalsData((prev) => {
      const updated = [...prev.actionSteps];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, actionSteps: updated };
    });
  };

  const handleCtaButtonChange = (index: number, key: keyof CallToAction, value: string) => {
    setGoalsData((prev) => {
      const updated = [...prev.ctaButtons];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, ctaButtons: updated };
    });
  };

  const tabs = [
    { id: 'hero' as TabType, name: 'Hero Banner', icon: FileText, desc: 'Institutional vision main intro banner and subtitles' },
    { id: 'goals' as TabType, name: 'Institutional Goals', icon: Target, desc: 'Eight pillar institutional goals and main tagline' },
    { id: 'strategy' as TabType, name: 'Strategic Roadmap', icon: Compass, desc: 'Strategic milestones, revamp tasks and timelines' },
    { id: 'cta' as TabType, name: 'CTA Buttons', icon: Megaphone, desc: 'Interactive response buttons and vision apply sections' },
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col font-sans text-[#171717]">
      {/* Dynamic Floating Toast Alerts matching styling instructions */}
      {toast.show && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce shadow-2xl rounded-xl p-4 max-w-md flex items-center gap-3 border bg-white">
          {toast.type === 'success' && <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />}
          {toast.type === 'error' && <XCircle className="h-6 w-6 text-red-600 flex-shrink-0" />}
          {toast.type === 'warning' && <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0" />}
          <div>
            <p className="text-sm font-bold text-gray-900">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Top Header Matching History page layout */}
      <div className="bg-[#631012] text-white py-6 px-4 sm:px-8 border-b-4 border-[#171717] shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2.5 rounded-lg border border-white/10">
              <Target size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider">Institutional Goals & Roadmap</h1>
              <p className="text-xs text-white/70 font-medium">Bilingual Content Management Portal (English / हिन्दी)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-black/20 px-3.5 py-1.5 rounded-full border border-white/10 flex items-center gap-2 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Live API Connection
            </div>
            <button
              onClick={fetchGoalsData}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              Sync Database
            </button>
          </div>
        </div>
      </div>

      {/* Core Workspace Grid */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Navigation Sidebar Tabs matching History layout */}
          <div className="lg:col-span-3 space-y-3">
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <p className="text-xs font-extrabold text-[#171717]/40 uppercase tracking-widest mb-3 px-2">Portal Navigation</p>
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left p-3.5 rounded-xl transition-all flex items-start gap-3 border ${
                        isActive
                          ? 'bg-[#631012]/5 border-[#631012] text-[#631012] shadow-sm font-semibold'
                          : 'bg-transparent border-transparent text-gray-600 hover:bg-gray-50 hover:text-[#171717]'
                      }`}
                    >
                      <Icon size={20} className={`mt-0.5 ${isActive ? 'text-[#631012]' : 'text-gray-400'}`} />
                      <div>
                        <p className="text-sm font-bold leading-none">{tab.name}</p>
                        <p className="text-[11px] text-gray-400 font-medium mt-1">{tab.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
              <p className="text-xs font-semibold text-gray-500">System Mode</p>
              <div className="mt-2.5 py-2 px-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center gap-2">
                <Globe size={14} className="text-[#631012]" />
                <span className="text-xs font-bold text-gray-700">Dual-Language Active</span>
              </div>
            </div>
          </div>

          {/* Form Content Panel matching History Style layout */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* HERO SECTION TAB */}
            {activeTab === 'hero' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-base font-extrabold text-[#171717]">Hero Banner Introduction</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure the landing title text and vision explanations across both languages side-by-side.</p>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      {/* English Hero Form */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-[#631012]/10 text-[#631012] text-xs font-extrabold rounded">EN</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">English Language Version</span>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Hero Heading (English)</label>
                          <input
                            type="text"
                            value={goalsData.heroHeading_en}
                            onChange={(e) => handleMainChange('heroHeading_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Hero Description (English)</label>
                          <textarea
                            rows={4}
                            value={goalsData.heroDescription_en}
                            onChange={(e) => handleMainChange('heroDescription_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveHero('en')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'en' && savingSide.section === 'hero' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save English Hero
                          </button>
                        </div>
                      </div>

                      {/* Hindi Hero Form */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded">HI</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Hindi Language Version (हिन्दी)</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Hero Heading (Hindi)</label>
                          <input
                            type="text"
                            value={goalsData.heroHeading_hi}
                            onChange={(e) => handleMainChange('heroHeading_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Hero Description (Hindi)</label>
                          <textarea
                            rows={4}
                            value={goalsData.heroDescription_hi}
                            onChange={(e) => handleMainChange('heroDescription_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveHero('hi')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'hi' && savingSide.section === 'hero' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save Hindi Hero
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* GOALS SECTION TAB */}
            {activeTab === 'goals' && (
              <div className="space-y-8">
                {/* 1. Main section headings side-by-side */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-base font-extrabold text-[#171717]">Goals Section Headings</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure section-wide titles and descriptions across English and Hindi.</p>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      {/* English headings */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-[#631012]/10 text-[#631012] text-xs font-extrabold rounded">EN</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">English Headers</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Goals Section Heading</label>
                          <input
                            type="text"
                            value={goalsData.goalsHeading_en}
                            onChange={(e) => handleMainChange('goalsHeading_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Section Subtitle</label>
                          <textarea
                            rows={3}
                            value={goalsData.goalsSubtitle_en}
                            onChange={(e) => handleMainChange('goalsSubtitle_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveGoalsHeading('en')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'en' && savingSide.section === 'goalsHeading' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save English Header
                          </button>
                        </div>
                      </div>

                      {/* Hindi headings */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded">HI</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Hindi Headers (हिन्दी)</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Goals Section Heading (Hindi)</label>
                          <input
                            type="text"
                            value={goalsData.goalsHeading_hi}
                            onChange={(e) => handleMainChange('goalsHeading_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Section Subtitle (Hindi)</label>
                          <textarea
                            rows={3}
                            value={goalsData.goalsSubtitle_hi}
                            onChange={(e) => handleMainChange('goalsSubtitle_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveGoalsHeading('hi')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'hi' && savingSide.section === 'goalsHeading' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save Hindi Header
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. List of dynamic individual goal items side-by-side */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-base font-extrabold text-[#171717]">Institutional Goals List</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure individual target pillars. English and Hindi are edited side-by-side and saved with individual section buttons.</p>
                  </div>

                  <div className="p-6 space-y-6 divide-y divide-gray-100">
                    {goalsData.goals.map((item, index) => (
                      <div key={item.id || index} className={`pt-6 ${index === 0 ? 'pt-0' : ''} space-y-4`}>
                        <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                          <span className="text-xs font-black uppercase tracking-wider text-[#631012] bg-[#631012]/10 px-2.5 py-1 rounded">Goal Pillar #{index + 1}</span>
                          <button
                            onClick={() => handleDeleteGoalItem(item.id!, index)}
                            disabled={savingSide.side !== null}
                            className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors flex items-center gap-1 text-xs font-bold"
                          >
                            {savingSide.section === `delete-goal-${item.id}` ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                            Remove Pillar
                          </button>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                          {/* English column item */}
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Pillar Title (English)</label>
                              <input
                                type="text"
                                value={item.title_en}
                                onChange={(e) => handleGoalItemChange(index, 'title_en', e.target.value)}
                                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-xs bg-white font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Description (English)</label>
                              <textarea
                                rows={2}
                                value={item.description_en}
                                onChange={(e) => handleGoalItemChange(index, 'description_en', e.target.value)}
                                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-xs bg-white"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Link Text (English)</label>
                              <input
                                type="text"
                                value={item.linkText_en}
                                onChange={(e) => handleGoalItemChange(index, 'linkText_en', e.target.value)}
                                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-xs bg-white text-[#631012] font-semibold"
                              />
                            </div>
                            <div className="flex justify-end pt-2">
                              <button
                                onClick={() => handleUpdateGoalItem(item.id!, index, 'en')}
                                disabled={savingSide.side !== null}
                                className="bg-[#631012] hover:bg-[#7a1214] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                              >
                                {savingSide.side === 'en' && savingSide.section === `goal-${item.id}` ? (
                                  <Loader2 className="animate-spin w-3 h-3" />
                                ) : (
                                  <Save size={12} />
                                )}
                                Save English
                              </button>
                            </div>
                          </div>

                          {/* Hindi column item */}
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Pillar Title (Hindi)</label>
                              <input
                                type="text"
                                value={item.title_hi}
                                onChange={(e) => handleGoalItemChange(index, 'title_hi', e.target.value)}
                                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-xs bg-white font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Description (Hindi)</label>
                              <textarea
                                rows={2}
                                value={item.description_hi}
                                onChange={(e) => handleGoalItemChange(index, 'description_hi', e.target.value)}
                                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-xs bg-white"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Link Text (Hindi)</label>
                              <input
                                type="text"
                                value={item.linkText_hi}
                                onChange={(e) => handleGoalItemChange(index, 'linkText_hi', e.target.value)}
                                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-xs bg-white text-[#631012] font-semibold"
                              />
                            </div>
                            <div className="flex justify-end pt-2">
                              <button
                                onClick={() => handleUpdateGoalItem(item.id!, index, 'hi')}
                                disabled={savingSide.side !== null}
                                className="bg-[#631012] hover:bg-[#7a1214] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                              >
                                {savingSide.side === 'hi' && savingSide.section === `goal-${item.id}` ? (
                                  <Loader2 className="animate-spin w-3 h-3" />
                                ) : (
                                  <Save size={12} />
                                )}
                                Save Hindi
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Insert Goal form matching History style box */}
                    <div className="bg-gray-50/70 p-5 rounded-xl border-2 border-dashed border-gray-200 mt-6 space-y-4">
                      <div className="flex items-center gap-2">
                        <Plus className="h-5 w-5 text-[#631012]" />
                        <h3 className="text-xs font-extrabold text-[#171717] uppercase tracking-wider">Add New Goal Item</h3>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* New Goal English details */}
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-[#631012] uppercase tracking-wider">English Language</p>
                          <input
                            type="text"
                            value={newGoal.title_en}
                            onChange={(e) => setNewGoal({ ...newGoal, title_en: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white font-semibold"
                            placeholder="Title English"
                          />
                          <textarea
                            rows={2}
                            value={newGoal.description_en}
                            onChange={(e) => setNewGoal({ ...newGoal, description_en: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white"
                            placeholder="Description English"
                          />
                          <input
                            type="text"
                            value={newGoal.linkText_en}
                            onChange={(e) => setNewGoal({ ...newGoal, linkText_en: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white text-[#631012]"
                            placeholder="Link text English"
                          />
                        </div>

                        {/* New Goal Hindi details */}
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Hindi Language (हिन्दी)</p>
                          <input
                            type="text"
                            value={newGoal.title_hi}
                            onChange={(e) => setNewGoal({ ...newGoal, title_hi: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white font-semibold"
                            placeholder="शीर्षक हिंदी"
                          />
                          <textarea
                            rows={2}
                            value={newGoal.description_hi}
                            onChange={(e) => setNewGoal({ ...newGoal, description_hi: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white"
                            placeholder="विवरण हिंदी"
                          />
                          <input
                            type="text"
                            value={newGoal.linkText_hi}
                            onChange={(e) => setNewGoal({ ...newGoal, linkText_hi: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white text-[#631012]"
                            placeholder="लिंक पाठ हिंदी"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={handleAddGoalItem}
                          disabled={savingSide.side !== null}
                          className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow"
                        >
                          {savingSide.section === 'addGoal' ? (
                            <Loader2 className="animate-spin w-3.5 h-3.5" />
                          ) : (
                            <Plus size={14} />
                          )}
                          Insert Goal Pillar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Section Tagline bilingual */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-base font-extrabold text-[#171717]">Goals Page Tagline Quote</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure the main tagline quote displayed at the footer of institutional goals.</p>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      {/* English Tagline */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-[#631012]/10 text-[#631012] text-xs font-extrabold rounded">EN</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">English Tagline</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Quote Label</label>
                          <input
                            type="text"
                            value={goalsData.tagline_en}
                            onChange={(e) => handleMainChange('tagline_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white italic text-[#631012] font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Quote Description</label>
                          <textarea
                            rows={3}
                            value={goalsData.taglineDescription_en}
                            onChange={(e) => handleMainChange('taglineDescription_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveTagline('en')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'en' && savingSide.section === 'tagline' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save English Tagline
                          </button>
                        </div>
                      </div>

                      {/* Hindi Tagline */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded">HI</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Hindi Tagline (हिन्दी)</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Quote Label (Hindi)</label>
                          <input
                            type="text"
                            value={goalsData.tagline_hi}
                            onChange={(e) => handleMainChange('tagline_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white italic text-[#631012] font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Quote Description (Hindi)</label>
                          <textarea
                            rows={3}
                            value={goalsData.taglineDescription_hi}
                            onChange={(e) => handleMainChange('taglineDescription_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveTagline('hi')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'hi' && savingSide.section === 'tagline' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save Hindi Tagline
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STRATEGY SECTION TAB */}
            {activeTab === 'strategy' && (
              <div className="space-y-8">
                {/* 1. Strategy Headings side-by-side config */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-base font-extrabold text-[#171717]">Strategic roadmap Main Titles</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure the academic roadmap heading, subheading, and descriptions.</p>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      {/* English section info */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-[#631012]/10 text-[#631012] text-xs font-extrabold rounded">EN</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">English Titles</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Main Heading</label>
                          <input
                            type="text"
                            value={goalsData.strategyHeading_en}
                            onChange={(e) => handleMainChange('strategyHeading_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Subheading</label>
                          <input
                            type="text"
                            value={goalsData.strategySubheading_en}
                            onChange={(e) => handleMainChange('strategySubheading_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-semibold text-[#631012]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Description Text</label>
                          <textarea
                            rows={3}
                            value={goalsData.strategyDescription_en}
                            onChange={(e) => handleMainChange('strategyDescription_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveStrategyHeading('en')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'en' && savingSide.section === 'strategyHeading' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save English Strategy
                          </button>
                        </div>
                      </div>

                      {/* Hindi section info */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded">HI</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Hindi Titles (हिन्दी)</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Main Heading (Hindi)</label>
                          <input
                            type="text"
                            value={goalsData.strategyHeading_hi}
                            onChange={(e) => handleMainChange('strategyHeading_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Subheading (Hindi)</label>
                          <input
                            type="text"
                            value={goalsData.strategySubheading_hi}
                            onChange={(e) => handleMainChange('strategySubheading_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-semibold text-[#631012]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Description Text (Hindi)</label>
                          <textarea
                            rows={3}
                            value={goalsData.strategyDescription_hi}
                            onChange={(e) => handleMainChange('strategyDescription_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveStrategyHeading('hi')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'hi' && savingSide.section === 'strategyHeading' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save Hindi Strategy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Strategy Steps items inside neat cards */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-base font-extrabold text-[#171717]">Roadmap Action Plan Milestones</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure step events, target numbers, and milestones side-by-side.</p>
                  </div>

                  <div className="p-6 space-y-6 divide-y divide-gray-100">
                    {goalsData.actionSteps.map((item, index) => (
                      <div key={item.id || index} className={`pt-6 ${index === 0 ? 'pt-0' : ''} space-y-4`}>
                        <div className="flex flex-col sm:flex-row gap-3 justify-between sm:items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase tracking-wider text-[#171717] bg-gray-200 px-2.5 py-1 rounded">Milestone #{item.number}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-gray-400">Step index:</span>
                              <input
                                type="text"
                                value={item.number}
                                onChange={(e) => handleActionStepChange(index, 'number', e.target.value)}
                                className="w-12 p-1 text-center border text-xs rounded font-bold bg-white"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteActionStep(item.id!, index)}
                            disabled={savingSide.side !== null}
                            className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors flex items-center gap-1 text-xs font-bold self-end sm:self-auto"
                          >
                            {savingSide.section === `delete-step-${item.id}` ? (
                              <Loader2 className="animate-spin w-3 h-3" />
                            ) : (
                              <Trash2 size={12} />
                            )}
                            Remove Step
                          </button>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                          {/* English step info */}
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Step Title (English)</label>
                              <input
                                type="text"
                                value={item.title_en}
                                onChange={(e) => handleActionStepChange(index, 'title_en', e.target.value)}
                                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-xs bg-white font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Step Action Details (English)</label>
                              <textarea
                                rows={2}
                                value={item.description_en}
                                onChange={(e) => handleActionStepChange(index, 'description_en', e.target.value)}
                                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-xs bg-white text-gray-600 leading-relaxed"
                              />
                            </div>
                            <div className="flex justify-end pt-1">
                              <button
                                onClick={() => handleUpdateActionStep(item.id!, index, 'en')}
                                disabled={savingSide.side !== null}
                                className="bg-[#631012] hover:bg-[#7a1214] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                              >
                                {savingSide.side === 'en' && savingSide.section === `step-${item.id}` ? (
                                  <Loader2 className="animate-spin w-3 h-3" />
                                ) : (
                                  <Save size={12} />
                                )}
                                Save English
                              </button>
                            </div>
                          </div>

                          {/* Hindi step info */}
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Step Title (Hindi)</label>
                              <input
                                type="text"
                                value={item.title_hi}
                                onChange={(e) => handleActionStepChange(index, 'title_hi', e.target.value)}
                                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-xs bg-white font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Step Action Details (Hindi)</label>
                              <textarea
                                rows={2}
                                value={item.description_hi}
                                onChange={(e) => handleActionStepChange(index, 'description_hi', e.target.value)}
                                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-xs bg-white text-gray-600 leading-relaxed"
                              />
                            </div>
                            <div className="flex justify-end pt-1">
                              <button
                                onClick={() => handleUpdateActionStep(item.id!, index, 'hi')}
                                disabled={savingSide.side !== null}
                                className="bg-[#631012] hover:bg-[#7a1214] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                              >
                                {savingSide.side === 'hi' && savingSide.section === `step-${item.id}` ? (
                                  <Loader2 className="animate-spin w-3 h-3" />
                                ) : (
                                  <Save size={12} />
                                )}
                                Save Hindi
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Insert Action Step form matches History page form cards style */}
                    <div className="bg-gray-50/70 p-5 rounded-xl border-2 border-dashed border-gray-200 mt-6 space-y-4">
                      <div className="flex items-center gap-2">
                        <Plus className="h-5 w-5 text-[#631012]" />
                        <h3 className="text-xs font-extrabold text-[#171717] uppercase tracking-wider">Add New roadmap Step</h3>
                      </div>

                      <div className="w-full sm:w-1/4">
                        <label className="text-xs font-bold text-gray-500 block mb-1">Step Index Tag (e.g. 03)</label>
                        <input
                          type="text"
                          value={newActionStep.number}
                          onChange={(e) => setNewActionStep({ ...newActionStep, number: e.target.value })}
                          className="w-full p-2 border rounded text-xs bg-white font-black text-center"
                          placeholder="03"
                        />
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* New Action Step English details */}
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-[#631012] uppercase tracking-wider">English Language Details</p>
                          <input
                            type="text"
                            value={newActionStep.title_en}
                            onChange={(e) => setNewActionStep({ ...newActionStep, title_en: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white font-semibold"
                            placeholder="Milestone title English"
                          />
                          <textarea
                            rows={2}
                            value={newActionStep.description_en}
                            onChange={(e) => setNewActionStep({ ...newActionStep, description_en: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white"
                            placeholder="Milestone details English"
                          />
                        </div>

                        {/* New Action Step Hindi details */}
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Hindi Language Details (हिन्दी)</p>
                          <input
                            type="text"
                            value={newActionStep.title_hi}
                            onChange={(e) => setNewActionStep({ ...newActionStep, title_hi: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white font-semibold"
                            placeholder="मील का पत्थर शीर्षक हिंदी"
                          />
                          <textarea
                            rows={2}
                            value={newActionStep.description_hi}
                            onChange={(e) => setNewActionStep({ ...newActionStep, description_hi: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white"
                            placeholder="मील का पत्थर विवरण हिंदी"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={handleAddActionStep}
                          disabled={savingSide.side !== null}
                          className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow"
                        >
                          {savingSide.section === 'addActionStep' ? (
                            <Loader2 className="animate-spin w-3.5 h-3.5" />
                          ) : (
                            <Plus size={14} />
                          )}
                          Insert step To roadmap
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CTA SECTION TAB */}
            {activeTab === 'cta' && (
              <div className="space-y-8">
                {/* 1. CTA Headings configs */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-base font-extrabold text-[#171717]">Call to Action Banner text</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure call to action head text requesting admission apply entries or research alliance milestones.</p>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      {/* English details */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-[#631012]/10 text-[#631012] text-xs font-extrabold rounded">EN</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">English Banner Content</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">CTA Heading Text</label>
                          <input
                            type="text"
                            value={goalsData.ctaHeading_en}
                            onChange={(e) => handleMainChange('ctaHeading_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">CTA Description Paragraph</label>
                          <textarea
                            rows={3}
                            value={goalsData.ctaDescription_en}
                            onChange={(e) => handleMainChange('ctaDescription_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveCtaHeading('en')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'en' && savingSide.section === 'ctaHeading' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save English CTA
                          </button>
                        </div>
                      </div>

                      {/* Hindi details */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded">HI</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Hindi Banner Content (हिन्दी)</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">CTA Heading Text (Hindi)</label>
                          <input
                            type="text"
                            value={goalsData.ctaHeading_hi}
                            onChange={(e) => handleMainChange('ctaHeading_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">CTA Description Paragraph (Hindi)</label>
                          <textarea
                            rows={3}
                            value={goalsData.ctaDescription_hi}
                            onChange={(e) => handleMainChange('ctaDescription_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveCtaHeading('hi')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'hi' && savingSide.section === 'ctaHeading' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save Hindi CTA
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Interactive CTA Button links stack */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-base font-extrabold text-[#171717]">Interactive Link Buttons</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure active links displayed under your Call to Action banners.</p>
                  </div>

                  <div className="p-6 space-y-6 divide-y divide-gray-100">
                    {goalsData.ctaButtons.map((button, index) => (
                      <div key={button.id || index} className={`pt-6 ${index === 0 ? 'pt-0' : ''} space-y-4`}>
                        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                          <span className="text-xs font-black uppercase tracking-wider text-[#631012] bg-[#631012]/10 px-2 py-1 rounded">Interactive Button #{index + 1}</span>
                          <button
                            onClick={() => handleDeleteCtaButton(button.id!, index)}
                            disabled={savingSide.side !== null}
                            className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors flex items-center gap-1 text-xs font-bold"
                          >
                            {savingSide.section === `delete-btn-${button.id}` ? (
                              <Loader2 className="animate-spin w-3 h-3" />
                            ) : (
                              <Trash2 size={12} />
                            )}
                            Remove Button
                          </button>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                          {/* English button text */}
                          <div>
                            <label className="text-xs font-bold text-gray-500 block mb-1">Button Label (English)</label>
                            <input
                              type="text"
                              value={button.buttonText_en}
                              onChange={(e) => handleCtaButtonChange(index, 'buttonText_en', e.target.value)}
                              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-xs bg-white font-bold"
                            />
                            <div className="flex justify-end pt-2">
                              <button
                                onClick={() => handleUpdateCtaButton(button.id!, index, 'en')}
                                disabled={savingSide.side !== null}
                                className="bg-[#631012] hover:bg-[#7a1214] text-white px-3 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                              >
                                {savingSide.side === 'en' && savingSide.section === `btn-${button.id}` ? (
                                  <Loader2 className="animate-spin w-3 h-3" />
                                ) : (
                                  <Save size={12} />
                                )}
                                Save English
                              </button>
                            </div>
                          </div>

                          {/* Hindi button text */}
                          <div>
                            <label className="text-xs font-bold text-gray-500 block mb-1">Button Label (Hindi)</label>
                            <input
                              type="text"
                              value={button.buttonText_hi}
                              onChange={(e) => handleCtaButtonChange(index, 'buttonText_hi', e.target.value)}
                              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-xs bg-white font-bold"
                            />
                            <div className="flex justify-end pt-2">
                              <button
                                onClick={() => handleUpdateCtaButton(button.id!, index, 'hi')}
                                disabled={savingSide.side !== null}
                                className="bg-[#631012] hover:bg-[#7a1214] text-white px-3 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                              >
                                {savingSide.side === 'hi' && savingSide.section === `btn-${button.id}` ? (
                                  <Loader2 className="animate-spin w-3 h-3" />
                                ) : (
                                  <Save size={12} />
                                )}
                                Save Hindi
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Insert Button form card */}
                    <div className="bg-gray-50/70 p-5 rounded-xl border-2 border-dashed border-gray-200 mt-6 space-y-4">
                      <div className="flex items-center gap-2">
                        <Plus className="h-5 w-5 text-[#631012]" />
                        <h3 className="text-xs font-extrabold text-[#171717] uppercase tracking-wider">Add New CTA Button</h3>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* New Goal English details */}
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-[#631012] uppercase tracking-wider">English Label Text</p>
                          <input
                            type="text"
                            value={newCtaButton.buttonText_en}
                            onChange={(e) => setNewCtaButton({ ...newCtaButton, buttonText_en: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white font-semibold"
                            placeholder="Ex: Learn More"
                          />
                        </div>

                        {/* New Goal Hindi details */}
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Hindi Label Text (हिन्दी)</p>
                          <input
                            type="text"
                            value={newCtaButton.buttonText_hi}
                            onChange={(e) => setNewCtaButton({ ...newCtaButton, buttonText_hi: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white font-semibold"
                            placeholder="जैसे: और सीखें"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={handleAddCtaButton}
                          disabled={savingSide.side !== null}
                          className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow"
                        >
                          {savingSide.section === 'addCtaButton' ? (
                            <Loader2 className="animate-spin w-3.5 h-3.5" />
                          ) : (
                            <Plus size={14} />
                          )}
                          Insert CTA Button
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final High-Fidelity Preview panel matching Maroon specs */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-[#FBFBFB]">
                    <p className="text-xs font-black text-[#171717]/40 uppercase tracking-wider">CTA Banner Live Presentation Preview</p>
                  </div>
                  <div className="p-6">
                    <div className="bg-gradient-to-r from-[#631012] to-[#8B1518] text-white rounded-xl p-8 text-center shadow-lg border-2 border-[#171717]">
                      <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
                        {goalsData.ctaHeading_en || 'Academic Vision Header'}
                      </h3>
                      <p className="text-xs sm:text-sm text-white/70 italic mb-4 font-medium">
                        {goalsData.ctaHeading_hi}
                      </p>
                      <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto leading-relaxed mb-6">
                        {goalsData.ctaDescription_en || 'Academic vision descriptions and guidelines...'}
                      </p>
                      <div className="flex flex-wrap gap-4 justify-center">
                        {goalsData.ctaButtons.map((button, index) => (
                          <button
                            key={button.id || index}
                            className={`px-5 py-2.5 rounded-lg font-bold text-xs transition-all shadow-md ${
                              index === 0
                                ? 'bg-white text-[#631012] hover:bg-gray-100'
                                : 'border-2 border-white text-white hover:bg-white/10'
                            }`}
                          >
                            {button.buttonText_en} / {button.buttonText_hi}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}