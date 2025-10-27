import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { config } from '@/constants/config';
import CustomHeader from '@/components/custom/customheader';
import SearchItem from '@/items/searchitem';
import CustomLoading from '@/components/custom/customloading';
import NoAds from '@/components/NoAds';

export default function SearchPage() {
  const { q } = useLocalSearchParams();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);



  const searchResults = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${config.URL}/ad/search`, {
        query: q,
      });

      const results = response.data;

      setResults(results);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('Error searching ads:', error);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    searchResults();
  }, [q])




  return (
    <View>
      <CustomHeader title={`نتائج البحث عن: ${q}`} />
       {
        loading ? (
          <CustomLoading />
        ) : (
          results.length === 0 ? (
            <NoAds />
          ) : (
            results.map((item) => (
             <SearchItem key={item.id} item={item} />
            ))
          )
        )
       }
    </View>
  )
}
