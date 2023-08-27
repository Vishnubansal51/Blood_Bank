import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/Layout/Layout";
import API from "../../services/API";
import moment from "moment";
import { useSelector } from 'react-redux';

const Organisation = () => {
  const [data, setData] = useState([]);
  const {user} = useSelector(state => state.auth)
  // find org records
  const getOrganisation = async () => {
    try {
      if(user?.role ==='donor'){
        const { data } = await API.get("/inventory/get-organisation");
        
        if (data?.success) {
          setData(data?.ORG);
        }

      }
      if(user?.role ==='hospital'){
        const { data } = await API.get("/inventory/get-organisation-hsp");
        
        if (data?.success) {
          setData(data?.ORG);
        }

      }

    } catch (error) {
      
    }
  };
  useEffect(() => {
    getOrganisation();
  },[]);

  return (
    <Layout>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Phone No.</th>
            <th scope="col">Address</th>
            <th scope="col">Time & Date</th>
          </tr>
        </thead>
        <tbody>
          {/* map to extract data from data */}
          {data?.map((record) => (
            <tr key={record._id}>
              <td>{record.organisationName }</td>
              <td>{record.email}</td>
              <td>{record.phone}</td>
              <td>{record.address}</td>

              <td>{moment(record.createdAt).format("DD/MM/YYYY hh:mm:s A")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default Organisation;
