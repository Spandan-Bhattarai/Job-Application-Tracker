import React, { useState } from 'react';
import { Plus, Filter, Download, Upload, Search, Briefcase, Sparkles } from 'lucide-react';
import { useApplications } from '../hooks/useApplications';
import { useAnalytics } from '../hooks/useAnalytics';
import { ApplicationCard } from './ApplicationCard';
import { ApplicationForm } from './ApplicationForm';
import { AnalyticsWidget } from './AnalyticsWidget';
import { exportToCSV, parseCSV } from '../utils/csvUtils';
import { Application } from '../lib/nhost';

export function Dashboard() {
  const { applications, loading, addApplication, updateApplication, deleteApplication } = useApplications();
  const { analytics } = useAnalytics();
  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [filter, setFilter] = useState<'all' | 'active'>('active');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'all' || (filter === 'active' && app.status !== 'Rejected' && !app.is_archived);
    const matchesSearch = !searchTerm || 
      app.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.custom_tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  const handleExportCSV = () => {
    exportToCSV(filteredApplications);
  };

  const handleImportCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const parsedApps = await parseCSV(file);
      for (const app of parsedApps) {
        await addApplication(app as Omit<Application, 'id' | 'user_id' | 'created_at' | 'updated_at'>);
      }
      alert(`Successfully imported ${parsedApps.length} applications!`);
    } catch (error) {
      alert(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    event.target.value = '';
  };

  const handleEdit = (app: Application) => {
    setEditingApp(app);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingApp(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 rounded-full animate-pulse" />
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Analytics Widget */}
      <AnalyticsWidget analytics={analytics} />

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Applications
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {filteredApplications.length} {filteredApplications.length === 1 ? 'application' : 'applications'} found
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 md:gap-3 w-full lg:w-auto">
          <button
            onClick={() => setShowForm(true)}
            className="flex-1 lg:flex-none btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>Add New</span>
          </button>
          
          <button
            onClick={handleExportCSV}
            className="flex-1 lg:flex-none inline-flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export</span>
          </button>
          
          <label className="flex-1 lg:flex-none inline-flex items-center justify-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Import</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'active')}
            className="input py-2.5 pr-10 min-w-[180px]"
          >
            <option value="active">Active Applications</option>
            <option value="all">All Applications</option>
          </select>
        </div>
        
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by company, position, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-12"
          />
        </div>
      </div>

      {/* Applications Grid */}
      {filteredApplications.length === 0 ? (
        <div className="text-center py-16 md:py-20 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-6">
            <Briefcase className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {searchTerm ? 'No matching applications' : 'No applications yet'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            {searchTerm 
              ? 'Try adjusting your search terms or filters'
              : 'Start tracking your job search by adding your first application'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Add Your First Application
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {filteredApplications.map((app, index) => (
            <div 
              key={app.id} 
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'backwards' }}
            >
              <ApplicationCard
                application={app}
                onEdit={handleEdit}
                onDelete={deleteApplication}
                onUpdate={updateApplication}
              />
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <ApplicationForm
          application={editingApp}
          onClose={handleCloseForm}
          onSubmit={editingApp ? updateApplication : addApplication}
        />
      )}
    </div>
  );
}