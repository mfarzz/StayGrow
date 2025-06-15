'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  Eye, 
  Ban, 
  CheckCircle, 
  XCircle,
  Flag,
  MessageSquare,
  FileText,
  User,
  Calendar,
  Search,
  MoreVertical,
  Archive,
} from 'lucide-react';

interface FlaggedContent {
  id: string;
  type: 'project' | 'comment' | 'profile' | 'message';
  title: string;
  author: string;
  reportedBy: string;
  reason: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'reviewed' | 'approved' | 'rejected' | 'escalated';
  reportedAt: string;
  content: string;
  reportCount: number;
}

const ContentModerationPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const flaggedContent: FlaggedContent[] = [
    {
      id: '1',
      type: 'project',
      title: 'Inappropriate E-commerce Website',
      author: 'john_doe',
      reportedBy: 'user123',
      reason: 'Inappropriate content',
      severity: 'high',
      status: 'pending',
      reportedAt: '2025-05-29T10:30:00Z',
      content: 'This project contains inappropriate images and content that violates community guidelines...',
      reportCount: 3
    },
    {
      id: '2',
      type: 'comment',
      title: 'Spam Comment on React Tutorial',
      author: 'spammer_user',
      reportedBy: 'moderator1',
      reason: 'Spam',
      severity: 'medium',
      status: 'pending',
      reportedAt: '2025-05-29T09:15:00Z',
      content: 'Buy our amazing product now! Visit our website for incredible deals...',
      reportCount: 5
    },
    {
      id: '3',
      type: 'profile',
      title: 'Fake Profile Information',
      author: 'fake_mentor',
      reportedBy: 'admin',
      reason: 'Impersonation',
      severity: 'critical',
      status: 'escalated',
      reportedAt: '2025-05-29T08:45:00Z',
      content: 'User claiming to be a senior developer at Google with fabricated credentials...',
      reportCount: 1
    },
    {
      id: '4',
      type: 'message',
      title: 'Harassment in Direct Messages',
      author: 'toxic_user',
      reportedBy: 'victim_user',
      reason: 'Harassment',
      severity: 'high',
      status: 'reviewed',
      reportedAt: '2025-05-28T16:20:00Z',
      content: 'Repeated threatening and harassing messages sent to multiple users...',
      reportCount: 2
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-yellow-600 bg-yellow-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'high': return 'text-red-600 bg-red-100';
      case 'critical': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'reviewed': return 'text-blue-600 bg-blue-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'escalated': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project': return FileText;
      case 'comment': return MessageSquare;
      case 'profile': return User;
      case 'message': return MessageSquare;
      default: return FileText;
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === flaggedContent.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(flaggedContent.map(item => item.id));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on items:`, selectedItems);
    // Implementation for bulk actions
    setSelectedItems([]);
  };

  const handleItemAction = (id: string, action: string) => {
    console.log(`Performing ${action} on item:`, id);
    // Implementation for individual actions
  };

  const filteredContent = flaggedContent.filter(item => {
    const matchesFilter = selectedFilter === 'all' || item.type === selectedFilter;
    const matchesSeverity = selectedSeverity === 'all' || item.severity === selectedSeverity;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSeverity && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Moderation</h1>
        <p className="text-gray-600">Review and moderate flagged content to maintain community standards</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Types</option>
              <option value="project">Projects</option>
              <option value="comment">Comments</option>
              <option value="profile">Profiles</option>
              <option value="message">Messages</option>
            </select>

            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {selectedItems.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{selectedItems.length} selected</span>
              <button
                onClick={() => handleBulkAction('approve')}
                className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approve</span>
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                className="flex items-center space-x-1 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>
              <button
                onClick={() => handleBulkAction('archive')}
                className="flex items-center space-x-1 bg-gray-600 text-white px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                <Archive className="w-4 h-4" />
                <span>Archive</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectedItems.length === flaggedContent.length}
            onChange={handleSelectAll}
            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <label className="text-sm text-gray-600">Select all</label>
        </div>
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {filteredContent.map((item) => {
          const TypeIcon = getTypeIcon(item.type);
          const isSelected = selectedItems.includes(item.id);
          
          return (
            <div key={item.id} className={`bg-white rounded-xl shadow-sm border-2 transition-colors ${
              isSelected ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200'
            }`}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectItem(item.id)}
                      className="mt-1 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center space-x-2">
                          <TypeIcon className="w-5 h-5 text-gray-500" />
                          <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(item.severity)}`}>
                          {item.severity.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Author:</span> {item.author}
                        </div>
                        <div>
                          <span className="font-medium">Reported by:</span> {item.reportedBy}
                        </div>
                        <div>
                          <span className="font-medium">Reason:</span> {item.reason}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Flag className="w-4 h-4" />
                          <span>{item.reportCount} reports</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-700 line-clamp-2">{item.content}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(item.reportedAt).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleItemAction(item.id, 'view')}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View Details</span>
                          </button>
                          <button
                            onClick={() => handleItemAction(item.id, 'approve')}
                            className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleItemAction(item.id, 'reject')}
                            className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm"
                          >
                            <Ban className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredContent.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No flagged content found</h3>
          <p className="text-gray-600">No content matches your current filters.</p>
        </div>
      )}
    </div>
  );
};

export default ContentModerationPage;
