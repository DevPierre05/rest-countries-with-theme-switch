import { useState, useEffect } from "react";
import Header from "./Header"
import "./App.css";
import data from "../data.json"
import { nanoid } from "nanoid";
import { BsArrowLeft } from "react-icons/bs";
import { IoHome } from "react-icons/io5";
import { IoGlobeOutline } from "react-icons/io5";


function App() {
  const [theme, setTheme] = useState(() => JSON.parse(localStorage.getItem("theme")) || false);
  const [selectedCountryDiv, setSelectedCountryDiv] = useState({});
  const [searchedCountry, setSearchedCountry] = useState("");
  const [countryData, setCountryData] = useState(data);
  const [noResults, setNoResults] = useState("");
  const [formData, setFormData] = useState({
    country: "",
    region: "",
  });

  //This returns the root element of the document
  const element = document.documentElement;

  useEffect(() => {
    switch (theme) {
      case true:
        element.classList.add("dark");
        localStorage.setItem("theme", true);
        break;
      case false:
        element.classList.remove("dark");
        localStorage.setItem("theme", false);
        break;
    }
  }, [theme]);

  useEffect(() => {
    data.forEach((item) => (item.id = nanoid()));
  }, []);

  useEffect(() => {
    if (!formData.region) setCountryData(data);
    if (formData.region) {
      const filtered = data.filter((item) => {
        return item.region.toLowerCase() === formData.region;
      });
      setCountryData(filtered);
    }
  }, [formData]);


  useEffect(() => {
    if (searchedCountry) {
      const findCountry = data.filter((item) => item.name.toLowerCase() === searchedCountry.toLowerCase());
      setCountryData(findCountry);
      if(findCountry.length === 0) setNoResults(`We couldn't find a match for "${searchedCountry}".
      Please try another search`);
    }
  }, [searchedCountry]);



  //Function Theme Switch
  const handleSwitch = function () {
    setTheme((prevTheme) => !prevTheme);
  };

  const handleChange = function (e) {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  };

  const submit = function (e) {
    e.preventDefault();
    if (formData.country) {
      setSearchedCountry(formData.country);
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          country: "",
        };
      });
    }
  };

  // Function when country div is clicked
  const handleCountryClick = function (id) {
    return data.map((item) => {
      return item.id === id && setSelectedCountryDiv(item);
    });
    
  };

  // Language String
  const langString = function (data) {
    const lang = data?.map((item) => {
      return item.name;
    });
    return lang?.join(", ");
  };

  //Border Click functionality
  const borderClick = function(country) {
    return data.map((element) => {
      return element.name === country && setSelectedCountryDiv(element)
    })
  }

  // Border divs
  //Convert Country abbreviated text to full name
  const changeToFullName = function (code) {
    const findData = data.find((element) => {
      return element.alpha3Code === code;
    });
    return findData.name;
  };

  const borderDiv = function () {
    return selectedCountryDiv.borders?.map((item, i) => {
      return (
        <div
          onClick={() => borderClick(changeToFullName(item))}
          key={i}
          className="w-auto flex items-center justify-center text-center dark:bg-[#2b3945] text-sm shadow-md dark:text-gray-400 text-gray-600 px-4 py-1 rounded"
        >
          {changeToFullName(item)}
        </div>
      );
    });
  };

  //Back functionality
  const backToMain = function () {
    setSelectedCountryDiv({});
  };

  const home = function () {
    setSearchedCountry("");
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        region: "",
      };
    });
    setCountryData(data);
  };

  return (
    <>
      <main className="min-h-screen dark:bg-[#111517] dark:text-gray-100 bg-[#fafafa]">
        <div className="mx-auto md:max-w-8xl dark:bg-[#202c37]">
          <header className="dark:bg-[#2b3945] bg-white px-2 shadow-md md:px-16">
            <Header theme={theme} handleSwitch={handleSwitch} />
          </header>
          <main className="min-h-screen py-8 px-2 md:px-16">
            {searchedCountry && (
              <button
                onClick={home}
                className="flex items-center gap-2 ml-4 px-2 shadow-md rounded py-1 mb-2 dark:bg-[#2b3945] md:ml-0"
              >
                <span>
                  <IoHome />
                </span>
                Home
              </button>
            )}

            {Object.keys(selectedCountryDiv).length === 0 &&
            selectedCountryDiv.constructor === Object ? (
              <div>
                <div className="search flex flex-col gap-8 md:justify-between md:items-center md:flex-row">
                  <form onSubmit={submit} className="w-full">
                    <input
                      className="md:w-2/5 border-none cursor-pointer font-light dark:bg-[#2b3945] dark:placeholder-[#fafafa] p-4 md:p-4 text-sm rounded-md shadow-md outline-none"
                      name="country"
                      type="text"
                      placeholder="Search for a country...."
                      onChange={handleChange}
                      value={formData.country}
                    />
                  </form>

                  <select
                    className="dark:bg-[#2b3945] text-sm p-4 rounded-md w-2/5 md:w-1/3 shadow-md border-white outline-none"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Filter by Region</option>
                    <option value="africa">Africa</option>
                    <option value="americas">Americas</option>
                    <option value="asia">Asia</option>
                    <option value="europe">Europe</option>
                    <option value="oceania">Oceania</option>
                  </select>
                </div>

                {/* No Search Results */}
                {countryData.length === 0 && (
                  <div className="mt-16 w-full flex flex-col gap-6 items-center justify-center">
                    <IoGlobeOutline className="w-20 h-20" />
                    <h2 className="text-3xl text-center">Oooops...</h2>
                    <h2 className="text-3xl text-center">{noResults}</h2>
                  </div>
                )}

                {/* Image and Details of Countries */}
                <div className="grid-container gap-12">
                  {countryData.map((item, i) => {
                    return (
                      <article
                        key={i}
                        onClick={() => handleCountryClick(item.id)}
                        className="mt-12 w-64 dark:bg-[#2b3945] rounded-t-md rounded-b-md shadow-md overflow-x-hidden"
                      >
                        <img
                          src={item.flag}
                          alt="country flag"
                          className="w-64 h-44 object-cover"
                        />
                        <div className="mx-6 h-44 pb-10 leading-relaxed">
                          <h2 className="mt-6 text-xl font-extrabold tracking-wide">
                            {item.name}
                          </h2>
                          <p className="mt-3 text-sm font-semibold">
                            Population:{" "}
                            <span className="dark:text-gray-400 text-gray-600">
                              {item.population.toLocaleString()}
                            </span>
                          </p>
                          <p className="mt-1 text-sm font-semibold">
                            Region:{" "}
                            <span className="dark:text-gray-400 text-gray-600">
                              {item.region}
                            </span>
                          </p>
                          <p className="mt-1 text-sm font-semibold">
                            Capital:{" "}
                            <span className="dark:text-gray-400 text-gray-600">
                              {item.capital}
                            </span>
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="min-h-screen px-4 md:px-0">
                <button
                  onClick={backToMain}
                  className="flex items-center gap-x-2 dark:bg-[#2b3945] dark:text-slate-300 mt-4 px-10 text-sm rounded-md py-2 shadow-lg"
                >
                  <span>
                    <BsArrowLeft className="text-xl dark:text-white" />
                  </span>
                  Back
                </button>

                <div className="flex flex-col mt-16 mx-auto md:items-center md:justify-center md:gap-x-16 lg:gap-x-32 md:mt-20 md:flex-row">
                  <div className="basis-full md:basis-5/12">
                    <img
                      src={selectedCountryDiv.flag}
                      alt="country image flag"
                      className="h-64 md:h-96"
                    />
                  </div>
                  <div className="details mt-8 flex flex-col basis-full md:basis-7/12">
                    <h1 className="text-2xl font-extrabold tracking-wide">
                      {selectedCountryDiv.name}
                    </h1>
                    <div className="flex flex-col gap-4 mt-6 md:flex-row md:gap-x-12 lg:gap-x-28">
                      <div className="">
                        <p className="mt-3 text-md font-semibold">
                          Native Name:{" "}
                          <span className="dark:text-gray-400 text-gray-600">
                            {selectedCountryDiv.nativeName}
                          </span>
                        </p>
                        <p className="mt-3 text-md font-semibold">
                          Population:{" "}
                          <span className="dark:text-gray-400 text-gray-600">
                            {selectedCountryDiv.population.toLocaleString()}
                          </span>
                        </p>
                        <p className="mt-3 text-md font-semibold">
                          Region:{" "}
                          <span className="dark:text-gray-400 text-gray-600">
                            {selectedCountryDiv.region}
                          </span>
                        </p>
                        <p className="mt-3 text-md font-semibold">
                          Sub Region:{" "}
                          <span className="dark:text-gray-400 text-gray-600">
                            {selectedCountryDiv.subregion}
                          </span>
                        </p>
                        <p className="mt-3 text-md font-semibold">
                          Capital:{" "}
                          <span className="dark:text-gray-400 text-gray-600">
                            {selectedCountryDiv.capital}
                          </span>
                        </p>
                      </div>
                      <div className="">
                        <p className="mt-3 text-md font-semibold">
                          Top Level Domain:{" "}
                          <span className="dark:text-gray-400 text-gray-600">
                            {selectedCountryDiv.topLevelDomain[0]}
                          </span>
                        </p>
                        <p className="mt-3 text-md font-semibold">
                          Currencies:{" "}
                          <span className="dark:text-gray-400 text-gray-600">
                            {selectedCountryDiv.currencies[0].name}
                          </span>
                        </p>
                        <p className="mt-3 text-md font-semibold">
                          Languages:{" "}
                          <span className="dark:text-gray-400 text-gray-600">
                            {langString(selectedCountryDiv.languages)}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-4 flex-col md:gap-2 items-baseline md:flex-row">
                      <p className="mt-3 w-1/2 text-md font-semibold md:w-1/4">
                        Border Countries:{" "}
                      </p>
                      <div className="grid grid-cols-3 gap-4 cursor-pointer md:grid-cols-3 md:gap-3">
                        {borderDiv()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </main>
      <footer className="dark:bg-gray-600 dark:text-slate-200 text-center">
        Challenge by <span><a className="underline"href="https://www.frontendmentor.io/challenges/rest-countries-api-with-color-theme-switcher-5cacc469fec04111f7b848ca">Frontend Mentor</a></span>, Coded by{" "}
        <span><a className="underline" href="https://github.com/DevPierre05"target="_blank">Peter Osei</a></span>
      </footer>
    </>
  );
}

export default App;
