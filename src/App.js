import "./App.css";
import { useEffect, useState } from "react";
import CovidSummary from "./components/CovidSummary";
import LineGraph from "./components/LineGraph";
//import axios from './axios';
import axios from "./axios";
function App() {
  const [totalConfirmed, setTotalConfirmed] = useState(0);
  const [totalRecovered, setTotalRecovered] = useState(0);
  const [totalDeaths, setTotalDeaths] = useState(0);
  const [loading, setloading] = useState(false);
  //craete state value of Covidsummary
  const [covidSummary, setCovidsummary] = useState({});
  const [days, setDays] = useState(7);
  const [country, setCountry] = useState(""); //for default case
  //Hooks Component(Component Did mount)
  const[coronaCountAr,setCoronaCountAr]=useState([]);
 const [label, setLabel]=useState([]);

  useEffect(() => {
    // here we call the api
    setloading(true);
    axios
      .get("/summary")

      //you can handle this promise use by then and catch
      .then((res) => {
        setloading(false);

        if (res.status === 200) {
          setTotalConfirmed(res.data.Global.TotalConfirmed);
          setTotalRecovered(res.data.Global.TotalRecovered);
          setTotalDeaths(res.data.Global.TotalDeaths);
          //this is going provide three data like global country and one more
          setCovidsummary(res.data);
        }

        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  //create one more function to formate our date
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `0${d.getMonth() + 1}`.slice(-2); // when we 12 input will be 012=> 12
    const _date = d.getDate();
    return `${year}-${month}-${_date}`;
  };

  const countryHandler = (e) => {

    setCountry(e.target.value);
    //from and to datehow will we get that
    const d = new Date();
    const to = formatDate(d);
    const from = formatDate(d.setDate(d.getDate() - days));

   // console.log(from, to);
    getCoronaReportByDateRange(e.target.value,from,to);
  };
  const daysHandler = (e) => {
    setDays(e.target.value);
    const d = new Date();
    const to = formatDate(d);
    const from = formatDate(d.setDate(d.getDate() - e.target.value));
    getCoronaReportByDateRange(country,from,to)
  };
  const getCoronaReportByDateRange = (countrySlug, from, to) => {
    // here we are going to call api
    axios.get(
        `/country/${countrySlug}/status/confirmed?from=${from}T00:00:00Z&to=${to}T00:00:00Z`
      )
      // we can handle this promise using then and catch
      .then(res => {
      
        console.log(res);
//
        const yAxisCoronaCount=res.data.map(d => d.Cases);
        for(let d of res.data){
          console.log(d)
        }
        const xAxisLabel=res.data.map(d=> d.Date);
 
      const covidDetails= covidSummary.Countries.find(country=>country.Country===countrySlug);
  
       
        setCoronaCountAr(yAxisCoronaCount);

        setTotalConfirmed(covidDetails.TotalConfirmed);
         setTotalRecovered(covidDetails.TotalRecovered);
         setTotalDeaths(covidDetails.TotalDeaths);
        setLabel(xAxisLabel);
        //  console.log(xAxisLable);
      })
      .catch(error => {
        console.log(error);
      });
  };

  if (loading) {
    return <p>fetching data from server</p>;
  }

  return (
    <div className="App">
      <CovidSummary
      totalConfirmed = {totalConfirmed}
      totalRecovered = {totalRecovered}
      totalDeaths = {totalDeaths}


       
      />
      {/* we are going to set input handler */}
      <div style={{ textAlign: "center" }}>
        <select value={country} onChange={countryHandler}>
          <option value={""}>Select Country</option>
          {covidSummary.Countries &&
            covidSummary.Countries.map((country) => (
              <option key={country.Slug}>{country.Country}</option>
            ))}
        </select>
        <select value={days} onChange={daysHandler}>
          <option value="7">last 7 days</option>
          <option value="30">last 30 days</option>
          <option value="90">last 90 days</option>
        </select>
      </div>
      <LineGraph
      yAxis={coronaCountAr}
      label={label}
     />
      
    </div>
  );
}

export default App;