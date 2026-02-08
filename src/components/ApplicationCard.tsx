import React from 'react';
import { format } from 'date-fns';
import { Edit, Trash2, Calendar, Tag, FileText, MoreVertical, Archive, ArchiveRestore } from 'lucide-react';
import { Application } from '../lib/nhost';
import { useState, useRef, useEffect } from 'react';

interface ApplicationCardProps {
  application: Application;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Application>) => void;
}

export function ApplicationCard({ application, onEdit, onDelete, onUpdate }: ApplicationCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statusConfig = {
    Applied: { 
      bg: 'bg-blue-100 dark:bg-blue-900/30', 
      text: 'text-blue-700 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
      dot: 'bg-blue-500'
    },
    Waiting: { 
      bg: 'bg-amber-100 dark:bg-amber-900/30', 
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800',
      dot: 'bg-amber-500'
    },
    Interview: { 
      bg: 'bg-emerald-100 dark:bg-emerald-900/30', 
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800',
      dot: 'bg-emerald-500'
    },
    Rejected: { 
      bg: 'bg-red-100 dark:bg-red-900/30', 
      text: 'text-red-700 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800',
      dot: 'bg-red-500'
    },
  };

  const handleStatusChange = async (newStatus: Application['status']) => {
    await onUpdate(application.id, { status: newStatus });
  };

  const handleArchiveToggle = async () => {
    await onUpdate(application.id, { is_archived: !application.is_archived });
  };

  const config = statusConfig[application.status];

  return (
    <div className={`group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 md:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 hover:-translate-y-1 ${application.is_archived ? 'opacity-60' : ''}`}>
      {/* Status indicator line */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${config.dot} rounded-t-2xl`} />
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
            {application.company_name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base truncate">
            {application.position}
          </p>
        </div>
        
        <div className="relative ml-4" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <MoreVertical className="h-5 w-5 text-gray-400" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-10 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-2 min-w-[140px] animate-scale-in origin-top-right">
              <button
                onClick={() => {
                  onEdit(application);
                  setShowMenu(false);
                }}
                className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <Edit className="h-4 w-4 mr-3 text-gray-400" />
                Edit
              </button>
              <button
                onClick={() => {
                  handleArchiveToggle();
                  setShowMenu(false);
                }}
                className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                {application.is_archived ? (
                  <>
                    <ArchiveRestore className="h-4 w-4 mr-3 text-gray-400" />
                    Unarchive
                  </>
                ) : (
                  <>
                    <Archive className="h-4 w-4 mr-3 text-gray-400" />
                    Archive
                  </>
                )}
              </button>
              <div className="my-1 border-t border-gray-100 dark:border-gray-700" />
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this application?')) {
                    onDelete(application.id);
                  }
                  setShowMenu(false);
                }}
                className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-3" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {/* Date applied */}
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>Applied {format(new Date(application.date_applied), 'MMM d, yyyy')}</span>
        </div>

        {/* Status selector */}
        <div>
          <select
            value={application.status}
            onChange={(e) => handleStatusChange(e.target.value as Application['status'])}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${config.bg} ${config.text} ${config.border} focus:ring-2 focus:ring-blue-500/50 focus:outline-none cursor-pointer transition-all`}
          >
            <option value="Applied">Applied</option>
            <option value="Waiting">Waiting</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Recontact date */}
        {application.recontact_date && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0 text-amber-500" />
            <span>Follow up: {format(new Date(application.recontact_date), 'MMM d, yyyy')}</span>
          </div>
        )}

        {/* Tags */}
        {application.custom_tags.length > 0 && (
          <div className="flex items-start gap-1.5 flex-wrap">
            <Tag className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            {application.custom_tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Notes */}
        {application.notes && (
          <div className="flex items-start text-sm text-gray-600 dark:text-gray-400">
            <FileText className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
            <p className="line-clamp-2">{application.notes}</p>
          </div>
        )}

        {/* Archived badge */}
        {application.is_archived && (
          <div className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
            <Archive className="h-3 w-3" />
            Archived
          </div>
        )}
      </div>
    </div>
  );
}