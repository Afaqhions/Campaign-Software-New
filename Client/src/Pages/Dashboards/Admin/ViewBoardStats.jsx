import React from 'react';

const ViewBoardStats = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Board Statistics</h2>
      <p className="text-gray-600 mb-4">Overview of held and free boards.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-100 text-blue-800 rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold">Total Boards</h3>
          <p className="text-3xl font-bold mt-2">120</p>
        </div>

        <div className="bg-green-100 text-green-800 rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold">Free Boards</h3>
          <p className="text-3xl font-bold mt-2">85</p>
        </div>

        <div className="bg-yellow-100 text-yellow-800 rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold">Held Boards</h3>
          <p className="text-3xl font-bold mt-2">35</p>
        </div>

        <div className="bg-gray-100 text-gray-800 rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold">Last Updated</h3>
          <p className="text-lg mt-2">27 July 2025</p>
        </div>
      </div>
    </div>
  );
};

export default ViewBoardStats;
