import Image from 'next/image'
import { Inter } from 'next/font/google'
import React, { useState } from 'react'
import axios from 'axios'

// MUI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';


import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { countries } from '@/assets/country'

const inter = Inter({ subsets: ['latin'] })



axios.defaults.headers['X-API-KEY'] = 'plMMwsN/D3Vwulc7iYzjAg==bXMyPgefor2BOoj6';
export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState("")
  const [gdp, setGdp] = useState("0")
  const [loading, setLoading] = useState(false)

  const fetchCountryData = async (country: string) => {
    const response = await axios.get(`https://api.api-ninjas.com/v1/country?name=${country}`)
    return response.data
  }

  const handleCountryChange = async (e: any) => {
    setLoading(true)
    setSelectedCountry(e.target.value)
    const countryData = await fetchCountryData(e.target.value)

    const res = Intl.NumberFormat("en-US").format(countryData[0]?.gdp_per_capita || "0")
    setGdp(res);
    setLoading(false)
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-24 ${inter.className}`}
    >
      <div className='flex justify-center items-center p-36 gap-16 border-gray-500 border-[2px]'>
        <Autocomplete
          id="country-select-demo"
          sx={{ width: 300 }}
          options={countries}
          autoHighlight
          disableClearable  
          getOptionLabel={(option) => option.label}
          onSelect={handleCountryChange}
          renderOption={(props, option) => (
            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
              <img
                loading="lazy"
                width="20"
                srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                alt=""
              />
              {option.label}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select a country"
              inputProps={{
                ...params.inputProps,
                autoComplete: 'new-password', // disable autocomplete and autofill
              }}
            />
          )}
        />
        <div className='w-24'>
          {loading && <CircularProgress />}
          {!loading && '$' + `${gdp}`}
        </div>
      </div>

    </main>
  )
}
