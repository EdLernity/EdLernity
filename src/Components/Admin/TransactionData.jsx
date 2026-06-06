import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiInstancePrivate } from '../../Utils/AxiosInstance';
import { showSnackbar } from '../Utils/enQueSnackBar';

const TransactionData = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [secretKey, setSecretKey] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchName, setSearchName] = useState('');

  const {name,secretKeys}=useParams();    
  useEffect(() => {
if (secretKeys!="cudcic0svr" || name !="g6dovjshm0r7vu") {
window.location.href = "/";
}

  }, [])
  
  const handleSearch = async () => {
    if(!secretKey || !searchDate)
        {
            showSnackbar("Please fill all fields","error","top")
            return;
        }
    try {
      const response = await apiInstancePrivate.get(`/payments?date=${searchDate}`, {
        headers: {
          'Authorization': `Bearer ${secretKey}`,
        },
      });
      setData(response.data);
      const filtered = response.data.filter(item =>
        searchName ? item.name.toLowerCase().includes(searchName.toLowerCase()) : true
      );
      setFilteredData(filtered);
    } catch (error) {
    //   console.error('Error fetching data', error);
    setData([]);

    setFilteredData([])
    }
  };

  const handleNameSearch = (e) => {
    const name = e.target.value;
    setSearchName(name);
    const filtered = data.filter(item =>
      name ? item.name.toLowerCase().includes(name.toLowerCase()) : true
    );
    setFilteredData(filtered);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" viewBox="0 0 24 24"><path fill="currentColor" d="M2 19v-2h20v2zm1.15-6.05l-1.3-.75l.85-1.5H1V9.2h1.7l-.85-1.45L3.15 7L4 8.45L4.85 7l1.3.75L5.3 9.2H7v1.5H5.3l.85 1.5l-1.3.75l-.85-1.5zm8 0l-1.3-.75l.85-1.5H9V9.2h1.7l-.85-1.45l1.3-.75l.85 1.45l.85-1.45l1.3.75l-.85 1.45H15v1.5h-1.7l.85 1.5l-1.3.75l-.85-1.5zm8 0l-1.3-.75l.85-1.5H17V9.2h1.7l-.85-1.45l1.3-.75l.85 1.45l.85-1.45l1.3.75l-.85 1.45H23v1.5h-1.7l.85 1.5l-1.3.75l-.85-1.5z"></path></svg>
            </span>
            <input
              type="text"
              placeholder="Enter Secret Key"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" viewBox="0 0 24 24"><g fill="none"><rect width={18} height={15} x={3} y={6} stroke="currentColor" rx={2}></rect><path fill="currentColor" d="M3 10c0-1.886 0-2.828.586-3.414C4.172 6 5.114 6 7 6h10c1.886 0 2.828 0 3.414.586C21 7.172 21 8.114 21 10z"></path><path stroke="currentColor" strokeLinecap="round" d="M7 3v3m10-3v3"></path></g></svg>
            </span>
            <input
              type="date"
              placeholder="Search by date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSearch}
            className="w-full py-2 bg-blue-600 text-white rounded-lg"
          >
            Search
          </button>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="p-4">
          <label htmlFor="table-search" className="sr-only">Search</label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
              </svg>
            </div>
            <input
              type="text"
              id="table-search"
              value={searchName}
              onChange={handleNameSearch}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 pl-10 p-2.5"
              placeholder="Search by name"
            />
          </div>
        </div>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Payment Id</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Phone number</th>
              <th scope="col" className="px-6 py-3">Amount</th>
              <th scope="col" className="px-6 py-3">Transaction Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.paymentId} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                <td className="px-6 py-4">{item.paymentId}</td>
                <td className="px-6 py-4">{item.email}</td>
                <td className="px-6 py-4">{item.phoneNumber}</td>
                <td className="px-6 py-4">&#8377; {item.amount}</td>
                <td className="px-6 py-4">{moment(item.date).format("DD-MM-YYYY")}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionData;
