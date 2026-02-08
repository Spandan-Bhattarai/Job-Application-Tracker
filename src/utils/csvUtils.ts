import Papa from 'papaparse';
import { Application } from '../lib/nhost';

export function exportToCSV(applications: Application[]) {
  const csvData = applications.map(app => ({
    'Company Name': app.company_name,
    'Position': app.position,
    'Date Applied': app.date_applied,
    'Status': app.status,
    'Notes': app.notes || '',
    'Recontact Date': app.recontact_date || '',
    'Custom Tags': app.custom_tags.join(', '),
    'Is Archived': app.is_archived ? 'Yes' : 'No',
  }));

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `job-applications-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function parseCSV(file: File): Promise<Partial<Application>[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const applications = results.data.map((row: any) => ({
            company_name: row['Company Name'] || row.company_name || '',
            position: row['Position'] || row.position || '',
            date_applied: row['Date Applied'] || row.date_applied || '',
            status: (row['Status'] || row.status || 'Applied') as Application['status'],
            notes: row['Notes'] || row.notes || '',
            recontact_date: row['Recontact Date'] || row.recontact_date || null,
            custom_tags: (row['Custom Tags'] || row.custom_tags || '').split(',').map((tag: string) => tag.trim()).filter(Boolean),
            is_archived: (row['Is Archived'] || row.is_archived || 'No').toLowerCase() === 'yes',
          })).filter((app: any) => app.company_name && app.position && app.date_applied);
          
          resolve(applications);
        } catch (error) {
          reject(new Error('Error parsing CSV file'));
        }
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      }
    });
  });
}