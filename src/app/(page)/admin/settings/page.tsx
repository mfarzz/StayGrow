'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Database, 
  Mail, 
  Shield, 
  Globe, 
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
} from 'lucide-react';

interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface Setting {
  id: string;
  label: string;
  description: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'textarea' | 'password';
  value: string | number | boolean;
  options?: { label: string; value: string }[];
  required?: boolean;
  disabled?: boolean;
}

const SystemSettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});

  const sections: SettingSection[] = [
    {
      id: 'general',
      title: 'General Settings',
      description: 'Basic platform configuration',
      icon: Settings
    },
    {
      id: 'authentication',
      title: 'Authentication',
      description: 'User login and security settings',
      icon: Lock
    },
    {
      id: 'email',
      title: 'Email Configuration',
      description: 'SMTP and email notification settings',
      icon: Mail
    },
    {
      id: 'moderation',
      title: 'Content Moderation',
      description: 'Automated moderation and filtering',
      icon: Shield
    },
    {
      id: 'features',
      title: 'Feature Toggles',
      description: 'Enable or disable platform features',
      icon: Globe
    },
    {
      id: 'limits',
      title: 'System Limits',
      description: 'Rate limits and resource constraints',
      icon: Database
    }
  ];

  const [settings, setSettings] = useState<{ [section: string]: Setting[] }>({
    general: [
      {
        id: 'site_name',
        label: 'Site Name',
        description: 'The name of your platform',
        type: 'text',
        value: 'StayGrow',
        required: true
      },
      {
        id: 'site_description',
        label: 'Site Description',
        description: 'Brief description of your platform',
        type: 'textarea',
        value: 'Platform untuk belajar dan berbagi proyek programming'
      },
      {
        id: 'maintenance_mode',
        label: 'Maintenance Mode',
        description: 'Enable to prevent user access during updates',
        type: 'boolean',
        value: false
      },
      {
        id: 'default_language',
        label: 'Default Language',
        description: 'Default language for new users',
        type: 'select',
        value: 'id',
        options: [
          { label: 'Bahasa Indonesia', value: 'id' },
          { label: 'English', value: 'en' },
          { label: 'Español', value: 'es' }
        ]
      }
    ],
    authentication: [
      {
        id: 'require_email_verification',
        label: 'Require Email Verification',
        description: 'Users must verify email before accessing the platform',
        type: 'boolean',
        value: true
      },
      {
        id: 'password_min_length',
        label: 'Minimum Password Length',
        description: 'Minimum required password length',
        type: 'number',
        value: 8
      },
      {
        id: 'session_timeout',
        label: 'Session Timeout (hours)',
        description: 'How long before users are automatically logged out',
        type: 'number',
        value: 24
      },
      {
        id: 'google_oauth_enabled',
        label: 'Google OAuth',
        description: 'Allow users to login with Google',
        type: 'boolean',
        value: true
      }
    ],
    email: [
      {
        id: 'smtp_host',
        label: 'SMTP Host',
        description: 'SMTP server hostname',
        type: 'text',
        value: 'smtp.gmail.com'
      },
      {
        id: 'smtp_port',
        label: 'SMTP Port',
        description: 'SMTP server port',
        type: 'number',
        value: 587
      },
      {
        id: 'smtp_username',
        label: 'SMTP Username',
        description: 'SMTP authentication username',
        type: 'text',
        value: 'your-email@gmail.com'
      },
      {
        id: 'smtp_password',
        label: 'SMTP Password',
        description: 'SMTP authentication password',
        type: 'password',
        value: '••••••••••••'
      },
      {
        id: 'from_email',
        label: 'From Email',
        description: 'Default sender email address',
        type: 'text',
        value: 'noreply@staygrow.com'
      }
    ],
    moderation: [
      {
        id: 'auto_moderation_enabled',
        label: 'Auto Moderation',
        description: 'Enable automatic content moderation',
        type: 'boolean',
        value: true
      },
      {
        id: 'moderation_threshold',
        label: 'Moderation Threshold',
        description: 'Confidence threshold for auto-flagging content (0-100)',
        type: 'number',
        value: 75
      },
      {
        id: 'spam_detection',
        label: 'Spam Detection',
        description: 'Enable automatic spam detection',
        type: 'boolean',
        value: true
      },
      {
        id: 'profanity_filter',
        label: 'Profanity Filter',
        description: 'Filter inappropriate language',
        type: 'boolean',
        value: true
      }
    ],
    features: [
      {
        id: 'showcase_enabled',
        label: 'Showcase Projects',
        description: 'Allow users to share their projects',
        type: 'boolean',
        value: true
      },
      {
        id: 'mentorship_enabled',
        label: 'Mentorship Program',
        description: 'Enable mentor-mentee matching',
        type: 'boolean',
        value: true
      },
      {
        id: 'notifications_enabled',
        label: 'Push Notifications',
        description: 'Enable browser push notifications',
        type: 'boolean',
        value: true
      },
      {
        id: 'comments_enabled',
        label: 'Comments System',
        description: 'Allow comments on projects',
        type: 'boolean',
        value: true
      }
    ],
    limits: [
      {
        id: 'max_file_size',
        label: 'Max File Size (MB)',
        description: 'Maximum upload file size',
        type: 'number',
        value: 10
      },
      {
        id: 'max_projects_per_user',
        label: 'Max Projects per User',
        description: 'Maximum projects a user can create',
        type: 'number',
        value: 50
      },
      {
        id: 'rate_limit_requests',
        label: 'Rate Limit (requests/minute)',
        description: 'Maximum API requests per minute per user',
        type: 'number',
        value: 100
      },
      {
        id: 'daily_email_limit',
        label: 'Daily Email Limit',
        description: 'Maximum emails sent per day',
        type: 'number',
        value: 1000
      }
    ]
  });

  const handleSettingChange = (sectionId: string, settingId: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [sectionId]: prev[sectionId].map(setting =>
        setting.id === settingId ? { ...setting, value } : setting
      )
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      // Implementation for saving settings
      console.log('Saving settings:', settings);
      setHasChanges(false);
      // Show success notification
    } catch (error) {
      console.error('Error saving settings:', error);
      // Show error notification
    }
  };

  const handleReset = () => {
    // Implementation for resetting to defaults
    console.log('Resetting settings to defaults');
    setHasChanges(false);
  };

  const togglePasswordVisibility = (settingId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [settingId]: !prev[settingId]
    }));
  };

  const renderSetting = (setting: Setting, sectionId: string) => {
    const showPassword = showPasswords[setting.id];

    return (
      <div key={setting.id} className="border-b border-gray-200 pb-6 last:border-b-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-900 mb-1">
              {setting.label}
              {setting.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <p className="text-sm text-gray-600 mb-3">{setting.description}</p>
            
            <div className="max-w-md">
              {setting.type === 'text' && (
                <input
                  type="text"
                  value={String(setting.value)}
                  onChange={(e) => handleSettingChange(sectionId, setting.id, e.target.value)}
                  disabled={setting.disabled}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
                />
              )}
              
              {setting.type === 'password' && (
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={String(setting.value)}
                    onChange={(e) => handleSettingChange(sectionId, setting.id, e.target.value)}
                    disabled={setting.disabled}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility(setting.id)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              )}
              
              {setting.type === 'number' && (
                <input
                  type="number"
                  value={Number(setting.value)}
                  onChange={(e) => handleSettingChange(sectionId, setting.id, parseInt(e.target.value))}
                  disabled={setting.disabled}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
                />
              )}
              
              {setting.type === 'textarea' && (
                <textarea
                  value={String(setting.value)}
                  onChange={(e) => handleSettingChange(sectionId, setting.id, e.target.value)}
                  disabled={setting.disabled}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
                />
              )}
              
              {setting.type === 'boolean' && (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={Boolean(setting.value)}
                    onChange={(e) => handleSettingChange(sectionId, setting.id, e.target.checked)}
                    disabled={setting.disabled}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {setting.value ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              )}
              
              {setting.type === 'select' && (
                <select
                  value={String(setting.value)}
                  onChange={(e) => handleSettingChange(sectionId, setting.id, e.target.value)}
                  disabled={setting.disabled}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50"
                >
                  {setting.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
        <p className="text-gray-600">Configure platform settings and preferences</p>
      </div>

      {/* Save/Reset Bar */}
      {hasChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-800 font-medium">You have unsaved changes</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                    <div>
                      <div className={`font-medium ${isActive ? 'text-emerald-900' : ''}`}>
                        {section.title}
                      </div>
                      <div className={`text-xs ${isActive ? 'text-emerald-600' : 'text-gray-500'}`}>
                        {section.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {sections.find(s => s.id === activeSection)?.title}
              </h2>
              <p className="text-gray-600 mt-1">
                {sections.find(s => s.id === activeSection)?.description}
              </p>
            </div>
            
            <div className="p-6 space-y-6">
              {settings[activeSection]?.map((setting) => 
                renderSetting(setting, activeSection)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsPage;
