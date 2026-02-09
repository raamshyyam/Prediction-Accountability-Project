import React, { useState, useEffect } from 'react';
import { Language } from '../types.ts';
import { translations } from '../translations.ts';

interface AboutPageProps {
  lang: Language;
}

const aboutContentMD = `# About Prediction Accountability Platform (PAP)

## 🎯 Our Mission

**To democratize accountability in public discourse by creating a searchable, data-driven database of predictions and claims, enabling citizens, journalists, and researchers to expose bias, verify claims, and make informed decisions.**

## 📖 The Problem We're Solving

Every day, experts make predictions. Yet when these predictions fail, no one is held accountable.

### The Accountability Vacuum

Here's the harsh reality:

1. **No Follow-Up**: Predictions are scattered across dozens of platforms. Once made, they're forgotten.
2. **Selective Memory**: When predictions come true, claimants highlight them. When they fail, silence.
3. **Hidden Bias**: Bad forecasters maintain credibility because no one tracked their full record.
4. **Misinformation Thrives**: Vague predictions that are unfalsifiable spread unchecked.
5. **Post-Truth Era**: People can't distinguish credible experts from charlatans.

## 🌍 How PAP Works

PAP is a searchable, public database of predictions and claims made by public figures. Our platform allows:

- **Recording** specific predictions with verifiable details (dates, metrics, names)
- **Tracking** outcomes against predictions to calculate accuracy rates
- **Analyzing** patterns of accuracy for different experts and categories
- **Exposing** bias and inconsistency in public discourse

## 🎯 Key Features

### Vagueness Analysis
We analyze claims to identify how specific and measurable they are. More specific claims are easier to verify.

### Accuracy Tracking
Track the track record of different experts and organizations over time.

### Multi-Language Support
Available in English and Nepali, making accountability accessible to more people.

### Open Database
All data is searchable and public, promoting transparency.

## 💡 Why This Matters

In countries like Nepal, where media literacy is still developing, the ability to track and verify predictions is crucial for informed decision-making.

- **voters** can evaluate political predictions
- **Investors** can assess economic forecasters
- **Citizens** can identify misinformation
- **Researchers** can study patterns of bias and accuracy

## 🌱 Join Us

PAP is a community project. Help us build accountability in public discourse by:

- Contributing verified predictions
- Reporting on prediction outcomes
- Sharing PAP with journalists and researchers
- Providing feedback and suggestions`;

export const AboutPage: React.FC<AboutPageProps> = ({ lang }) => {
  const t = translations[lang];

  // Simple markdown to HTML converter for basic markdown syntax
  const renderMarkdown = (md: string) => {
    let html = md
      // Headers
      .replace(/^### (.*?)$/gm, '<h3 class="text-lg font-black text-slate-800 mt-6 mb-3">$1</h3>')
      .replace(/^## (.*?)$/gm, '<h2 class="text-2xl font-black text-slate-900 mt-8 mb-4">$1</h2>')
      .replace(/^# (.*?)$/gm, '<h1 class="text-4xl font-black text-slate-900 mb-6">$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-black">$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 underline hover:text-blue-800">$1</a>')
      // Line breaks
      .replace(/\n\n/g, '</p><p class="my-4">')
      .replace(/\n/g, '<br />');
    
    return `<p class="my-4">${html}</p>`;
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-12">
        <div className="prose prose-sm max-w-none">
          <div
            className="space-y-6 text-slate-700"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(aboutContentMD) }}
          />
        </div>
        
        {/* Key Statistics Section */}
        <div className="mt-16 pt-12 border-t border-slate-200">
          <h3 className="text-2xl font-black text-slate-900 mb-8">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
              <div className="text-3xl mb-3">📊</div>
              <h4 className="text-lg font-black text-slate-800 mb-2">Searchable Database</h4>
              <p className="text-sm text-slate-600">Easily search and filter thousands of predictions by claimant, category, and date.</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
              <div className="text-3xl mb-3">✅</div>
              <h4 className="text-lg font-black text-slate-800 mb-2">Accuracy Tracking</h4>
              <p className="text-sm text-slate-600">Track the accuracy and credibility of experts based on their prediction history.</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
              <div className="text-3xl mb-3">🔍</div>
              <h4 className="text-lg font-black text-slate-800 mb-2">Vagueness Analysis</h4>
              <p className="text-sm text-slate-600">Analyze claims for vagueness and identify falsifiable predictions.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
          <h3 className="text-xl font-black mb-3">Help Us Grow</h3>
          <p className="mb-4">PAP is a community-driven project. Help us build accountability in public discourse by:</p>
          <ul className="space-y-2 text-sm mb-6">
            <li>✓ Contributing verified predictions and claims</li>
            <li>✓ Reporting on prediction outcomes</li>
            <li>✓ Sharing PAP with journalists and researchers</li>
            <li>✓ Providing feedback and suggestions</li>
          </ul>
          <p className="text-blue-100 text-xs">This platform is designed to promote accountability and informed discourse.</p>
        </div>
      </div>
    </div>
  );
};
