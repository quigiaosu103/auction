'use client';

import { useAppSelector } from '@/context/store';
import { selectAccountId, selectIsLoading, selectWallet } from '@/features/walletSlice';
import { useEffect, useState } from 'react';
import { Item } from '../@types/Item.type';
import ItemList from './ItemList';

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME || '';
const LINK_API = process.env.NEXT_PUBLIC_WEB_URL || '';

const Content = () => {
    const wallet = useAppSelector(selectWallet);
    const account = useAppSelector(selectAccountId);
    const [walletReady, setWalletReady] = useState(false);
    const [data, setData] = useState<Item[]>([]);
    const isLoading = useAppSelector(selectIsLoading);

    useEffect(() => {
        if (!isLoading && wallet) {
            setWalletReady(true);
        }
    }, [isLoading, wallet]);

    useEffect(() => {
        if (!account) return;
        const getData = async () => {
            await fetch(`${LINK_API}/api/v1/product/all/${account}`)
                .then(async (response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const data: any = await response.json();

                    if (data.data) {
                        setData(data.data);
                    }
                    // Parse the JSON response
                    return response.json();
                })
                .then((data) => {
                    console.log('Data:', data);
                })
                .catch((error) => {
                    console.error('Fetch error:', error);
                });
        };
        getData();
    }, [walletReady]);

    return (
        <>
            <ItemList items={data} setItems={setData} />
        </>
    );
};

export default Content;
