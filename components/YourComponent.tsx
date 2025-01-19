import React from 'react';

interface YourComponentProps {
  children: React.ReactNode;
  jsx: boolean;
}

const YourComponent: React.FC<YourComponentProps> = ({ children, jsx }) => {
  return (
    <div>
      {jsx ? <style>{children}</style> : children}
    </div>
  );
};

export default YourComponent;