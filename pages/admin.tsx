import React from 'react';
import AdminDashboard from '../components/admin/AdminDashboard';
import { Listing } from '../utils/supabaseUtils';

const AdminPage: React.FC = () => {
  return <AdminDashboard listings={[]} onDelete={function (id: string): Promise<void> {
    throw new Error('Function not implemented.');
  } } onEdit={function (listing: Listing): void {
    throw new Error('Function not implemented.');
  } } />;
};

export default AdminPage;
