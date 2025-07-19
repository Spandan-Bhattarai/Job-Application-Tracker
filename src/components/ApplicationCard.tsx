import React from 'react';
import { format } from 'date-fns';
import { Edit, Trash2, Calendar, Tag, FileText, MoreVertical } from 'lucide-react';
import { Application } from '../lib/supabase';
import { useState } from 'react';

interface ApplicationCardProps {
  application: Application;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Application>) => void;
}

export function ApplicationCard({ application, onEdit, onDelete, onUpdate }: ApplicationCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const statusColors = {
    Applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    Waiting: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    Interview: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  };

  const handleStatusChange = async (newStatus: Application['status']) => {
    await onUpdate(application.id, { status: newStatus });
  };

  const handleArchiveToggle = async () => {
    await onUpdate(application.id, { is_archived: !application.is_archived });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {application.company_name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            {application.position}
          </p>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            {format(new Date(application.date_applied), 'MMM d, yyyy')}
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <MoreVertical className="h-5 w-5 text-gray-400" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-8 z-10 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1 min-w-[120px]">
              <button
                onClick={() => {
                  onEdit(application);
                  setShowMenu(false);
                }}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={() => {
                  handleArchiveToggle();
                  setShowMenu(false);
                }}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                {application.is_archived ? 'Unarchive' : 'Archive'}
              </button>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this application?')) {
                    onDelete(application.id);
                  }
                  setShowMenu(false);
                }}
                className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <select
            value={application.status}
            onChange={(e) => handleStatusChange(e.target.value as Application['status'])}
            className={`px-3 py-1 rounded-full text-sm font-medium border-0 focus:ring-2 focus:ring-blue-500 ${statusColors[application.status]}`}
          >
            <option value="Applied">Applied</option>
            <option value="Waiting">Waiting</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {application.recontact_date && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4 mr-1" />
            Recontact: {format(new Date(application.recontact_date), 'MMM d, yyyy')}
          </div>
        )}

        {application.custom_tags.length > 0 && (
          <div className="flex items-center flex-wrap gap-1">
            <Tag className="h-4 w-4 text-gray-400 mr-1" />
            {application.custom_tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {application.notes && (
          <div className="flex items-start text-sm text-gray-600 dark:text-gray-400">
            <FileText className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
            <p className="line-clamp-2">{application.notes}</p>
          </div>
        )}

        {application.is_archived && (
          <div className="text-xs text-gray-500 dark:text-gray-500 italic">
            Archived
          </div>
        )}
      </div>
    </div>
  );
}