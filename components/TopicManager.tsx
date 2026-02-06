import React, { useState, useEffect } from 'react';
import { Claim, Language } from '../types.ts';
import { translations } from '../translations.ts';

interface TopicManagerProps {
  claims: Claim[];
  lang: Language;
  onTopicSelect?: (topic: string) => void;
}

export const TopicManager: React.FC<TopicManagerProps> = ({ claims, lang, onTopicSelect }) => {
  const t = translations[lang];
  const [topics, setTopics] = useState<Map<string, number>>(new Map());
  const [newTopic, setNewTopic] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');

  useEffect(() => {
    // Extract all topics and count claims per topic
    const topicMap = new Map<string, number>();
    claims.forEach(claim => {
      if (claim.topicGroup) {
        topicMap.set(claim.topicGroup, (topicMap.get(claim.topicGroup) || 0) + 1);
      }
    });
    setTopics(topicMap);
  }, [claims]);

  const handleAddTopic = (topic: string) => {
    if (topic.trim() && !topics.has(topic)) {
      const newMap = new Map(topics);
      newMap.set(topic, 0);
      setTopics(newMap);
      setNewTopic('');
    }
  };

  const handleSelectTopic = (topic: string) => {
    setSelectedTopic(topic);
    onTopicSelect?.(topic);
  };

  const sortedTopics = Array.from(topics.entries())
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add new topic..."
          className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-sm font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddTopic(newTopic);
            }
          }}
        />
        <button
          onClick={() => handleAddTopic(newTopic)}
          className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sortedTopics.map(([topic, count]) => (
          <button
            key={topic}
            onClick={() => handleSelectTopic(topic)}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedTopic === topic
                ? 'border-blue-600 bg-blue-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <p className="font-bold text-slate-800">{topic}</p>
            <p className="text-sm text-slate-500">{count} claims</p>
          </button>
        ))}
      </div>

      {topics.size === 0 && (
        <div className="text-center py-8 text-slate-500">
          <p className="text-sm">No topics yet. Create one to organize claims!</p>
        </div>
      )}
    </div>
  );
};
