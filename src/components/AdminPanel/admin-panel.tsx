import {
  LINK_GET_PENDING_LIST,
  LINK_GET_SHOPVERIFICATION_IMAGE,
  LINK_GET_SHOP_DETAILS,
  LINK_LOGOUT,
} from '../misc';
import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';

import css from './admin-panel.module.css';
import leftArrow from '../../assets/icons/leftArrow.svg';
import { useQuery } from 'react-query';

async function logout() {
  console.log('TESTESTSETTS');
  localStorage.clear();
  await axios.get(LINK_LOGOUT).catch((error) => {
    console.log(error);
  });
  location.href = '/';
}

const getPendingList = async () => {
  const response = await axios.get(LINK_GET_PENDING_LIST, {
    withCredentials: true,
  });
  return response.data.response;
};

interface SellerData {
  id: number;
  isVerified: number;
  email: string;
  first_name: string;
  last_name: string;
}

interface PendingListProps {
  changeHandler: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  currValue: number;
}

const PendingList: React.FC<PendingListProps> = ({
  changeHandler,
  currValue,
}) => {
  const { status, data, error } = useQuery<
    'idle' | 'error' | 'loading' | 'success',
    AxiosError,
    Array<SellerData>
  >({
    queryKey: 'pendingList',
    queryFn: getPendingList,
  });

  return (
    <select
      name="pending"
      id="pending"
      value={currValue}
      onChange={changeHandler}
      className={css.pendingList}
    >
      {status === 'loading' && <option>Loading...</option>}
      {status === 'error' && <option>Error: {error.message}</option>}
      {status === 'success' && (
        <>
          <option value={-1}>Select a shop</option>
          {data.map((shop) => (
            <option key={shop.id} value={shop.id}>
              {shop.first_name} {shop.last_name}
            </option>
          ))}
        </>
      )}
    </select>
  );
};

interface ShopImageProps {
  resourceType: string;
  id: number;
  alt: string;
  classes: string;
}

interface ErrorData {
  error: string;
}

const ShopImage: React.FC<ShopImageProps> = ({
  resourceType,
  id,
  alt,
  classes,
}) => {
  const getImage = async () => {
    const response = await axios.get(LINK_GET_SHOPVERIFICATION_IMAGE, {
      params: {
        id: id,
        resource_type: resourceType,
      },
      responseType: 'arraybuffer', // Set the response type to 'arraybuffer'
      withCredentials: true,
    });
    console.log(id + ' ' + resourceType);
    console.log(response);
    return response.data;
  };

  const { status, data, error } = useQuery<
    'idle' | 'error' | 'loading' | 'success',
    AxiosError,
    ArrayBuffer
  >({
    queryKey: 'getImage',
    queryFn: getImage,
  });

  const imageBlobConverter = (data: ArrayBuffer) => {
    const imageBlob = new Blob([data], { type: 'image/png' });
    const imageUrl = URL.createObjectURL(imageBlob);
    return imageUrl;
  };

  if (status === 'loading')
    return <div className={css.imageLoading}>Image Loading</div>;
  if (status === 'error')
    return (
      <div className={css.imageLoading}>
        Error: {(error.response?.data as ErrorData).error}
      </div>
    );
  return (
    <>
      <img
        src={data && imageBlobConverter(data)}
        alt={alt}
        className={classes}
      />
    </>
  );
};

export default function AdminPanel() {
  const [selectedShopID, setSelectedShopID] = useState<number>(-1);
  const [shopDetails, setShopDetails] = useState<SellerData | null>(null);
  const [shopID1, setShopID1] = useState<string>('');
  useEffect(() => {
    axios
      .get(LINK_GET_SHOP_DETAILS, {
        params: {
          id: selectedShopID,
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        setShopDetails({ ...response.data, id: selectedShopID });
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(LINK_GET_SHOPVERIFICATION_IMAGE, {
        params: {
          id: selectedShopID,
          resource_type: 'selfie',
        },
        responseType: 'arraybuffer', // Set the response type to 'arraybuffer'
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        const imageBlob = new Blob([response.data], { type: 'image/png' });
        const imageUrl = URL.createObjectURL(imageBlob);
        setShopID1(imageUrl);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [selectedShopID]);

  return (
    <div className={css.wrapper}>
      <div className={css.header}>
        <img
          src={leftArrow}
          onClick={logout}
          alt="Back to login icon"
          className={css.back_icon}
        />
        <h1 className={css.title}>Admin Panel</h1>
      </div>
      <form action="" method="post" className={css.pendingContainer}>
        <label htmlFor="pending">
          <h2>Pending for Approval</h2>
        </label>
        <PendingList
          changeHandler={(event) =>
            setSelectedShopID(Number(event.target.value))
          }
          currValue={selectedShopID}
        />
        <button className={css.btnApprove}>Approve</button>
        <button className={css.btnReject}>Reject</button>
      </form>
      {selectedShopID !== -1 && (
        <div className={css.shopInfo}>
          <div className={css.shopDetailsAndSelfie}>
            <ShopImage
              resourceType="selfie"
              id={selectedShopID}
              alt="Owner selfie"
              classes={css.shopSelfie}
            />
            <img src={shopID1} alt="" />
          </div>
        </div>
      )}
    </div>
  );
}
