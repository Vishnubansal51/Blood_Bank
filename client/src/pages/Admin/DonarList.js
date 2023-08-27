import React, { useEffect, useState } from "react";
import Layout from "./../../components/shared/Layout/Layout";
import moment from "moment";
import API from "../../services/API";

const DonorList = () => {
  const [data, setData] = useState([]);

  // find doanr records
  const getdonors = async () => {
    try {
      const { data } = await API.get("/admin/donor-list");
    
      if(data?.success)
      {
        setData(data?.donor_data)
      }
    } catch (error) {
      
    }
  };
  useEffect(() => {
    getdonors();
  }, []);

  //delete function
  const handle_delete_donor =  async (id) =>{
    try{
      let ask = window.prompt('Are you really Want ot this data','YES')
      if(!ask) return 
      const {data} =  await  API.delete(`/admin/delete-donor/${id}`)
      alert(data?.message);
      window.location.reload();
    }
    catch(error){
      


    }
  }

  return (
    <Layout>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Phone No.</th>
            <th scope="col">Time & Date</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {/* map to extract data from data */}
          {data?.map((record) => (
            <tr key={record._id}>
              <td>{record.name || record.organisationName + 'ORG' }</td>
              <td>{record.email}</td>
              <td>{record.phone}</td>
              
              <td>{moment(record.createdAt).format("DD/MM/YYYY hh:mm:s A")}</td>
              <td>
                <button className="btn btn-danger  " onClick={() => handle_delete_donor(record._id)}> DELETE</button>
              </td>
            </tr>

          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default DonorList;
