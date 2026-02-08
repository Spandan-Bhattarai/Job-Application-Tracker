import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, FileText, Building, Briefcase, Archive, Plus, Sparkles } from 'lucide-react';
import { Application } from '../lib/nhost';

interface ApplicationFormProps {
  application?: Application | null;
  onClose: () => void;
  onSubmit: (id: string, data: any) => Promise<any> | ((data: any) => Promise<any>);
}

export function ApplicationForm({ application, onClose, onSubmit }: ApplicationFormProps) {
  const [formData, setFormData] = useState({
    company_name: '',
    position: '',
    date_applied: '',
    status: 'Applied' as Application['status'],
    notes: '',
    recontact_date: '',
    custom_tags: [] as string[],
    is_archived: false,
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (application) {
      setFormData({
        company_name: application.company_name,
        position: application.position,
        date_applied: application.date_applied,
        status: application.status,
        notes: application.notes || '',
        recontact_date: application.recontact_date || '',
        custom_tags: application.custom_tags,
        is_archived: application.is_archived,
      });
    }
  }, [application]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const sanitizedData = {
      ...formData,
      notes: formData.notes || null,
      recontact_date: formData.recontact_date || null,
    };

    try {
      if (application) {
        const { error } = await onSubmit(application.id, sanitizedData);
        if (error) throw new Error(error);
      } else {
        const { error } = await onSubmit(sanitizedData);
        if (error) throw new Error(error);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.custom_tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        custom_tags: [...prev.custom_tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      custom_tags: prev.custom_tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const statusOptions = [
    { value: 'Applied', color: 'bg-blue-500' },
    { value: 'Waiting', color: 'bg-amber-500' },
    { value: 'Interview', color: 'bg-emerald-500' },
    { value: 'Rejected', color: 'bg-red-500' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div 
        className="glass-card rounded-2xl md:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 md:p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${application ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
              {application ? (
                <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              ) : (
                <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              )}
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                {application ? 'Edit Application' : 'New Application'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {application ? 'Update your application details' : 'Track a new job application'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.company_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                  className="input pl-12"
                  placeholder="e.g. Google, Microsoft"
                  required
                />
              </div>
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Position <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  className="input pl-12"
                  placeholder="e.g. Software Engineer"
                  required
                />
              </div>
            </div>

            {/* Date Applied */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Applied <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.date_applied}
                  onChange={(e) => setFormData(prev => ({ ...prev, date_applied: e.target.value }))}
                  className="input pl-12"
                  required
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, status: option.value as Application['status'] }))}
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all duration-200 ${
                      formData.status === option.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${option.color}`} />
                    <span className="text-sm font-medium">{option.value}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recontact Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Recontact Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.recontact_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, recontact_date: e.target.value }))}
                  className="input pl-12"
                />
              </div>
            </div>

            {/* Archived Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Archive Status
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer">
                <div className={`relative w-11 h-6 rounded-full transition-colors ${formData.is_archived ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <input
                    type="checkbox"
                    checked={formData.is_archived}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_archived: e.target.checked }))}
                    className="sr-only"
                  />
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${formData.is_archived ? 'translate-x-5' : ''}`} />
                </div>
                <div className="flex items-center gap-2">
                  <Archive className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Mark as archived</span>
                </div>
              </label>
            </div>
          </div>

          {/* Custom Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Custom Tags
            </label>
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  className="input pl-12"
                  placeholder="e.g. Remote, Full-time"
                />
              </div>
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-colors font-medium"
              >
                Add
              </button>
            </div>
            {formData.custom_tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.custom_tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm rounded-full animate-scale-in"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:bg-blue-200 dark:hover:bg-blue-800/50 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={4}
                className="input pl-12 resize-none"
                placeholder="Add any notes about this application..."
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl animate-fade-in">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 md:p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                {application ? 'Update Application' : 'Create Application'}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}