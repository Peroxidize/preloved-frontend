import {
  LINK_APPROVE_OR_REJECT,
  LINK_GET_PENDING_LIST,
  LINK_GET_SHOPVERIFICATION_IMAGE,
  LINK_GET_SHOP_DETAILS,
  LINK_LOGOUT,
} from '../misc';
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';

import reject from '../../assets/icons/close.svg';
import check from '../../assets/icons/check.svg';
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
  console.log(response.data.response);
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
  status: 'idle' | 'error' | 'loading' | 'success';
  data?: Array<SellerData>;
  error?: AxiosError;
}

const PendingList: React.FC<PendingListProps> = ({
  changeHandler,
  currValue,
  status,
  data,
  error,
}) => {
  return (
    <select
      name="pending"
      id="pending"
      value={currValue}
      onChange={changeHandler}
      className={css.pendingList}
    >
      {status === 'loading' && <option>Loading...</option>}
      {status === 'error' && <option>Error: {error?.message}</option>}
      {status === 'success' && (
        <>
          <option value={-1}>Select a shop</option>
          {data?.map((shop) => (
            <option key={shop.id} value={shop.id}>
              ID: {shop.id} | Name: {shop.first_name} {shop.last_name}
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
  classes?: string;
  imageKey: number;
}

interface ErrorData {
  error: string;
}

const ShopImage: React.FC<ShopImageProps> = ({
  resourceType,
  id,
  alt,
  classes,
  imageKey,
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
  >(['shopImage' + imageKey, id], getImage);

  const imageBlobConverter = (data: ArrayBuffer) => {
    const imageBlob = new Blob([data], { type: 'image/png' });
    const imageUrl = URL.createObjectURL(imageBlob);
    return imageUrl;
  };

  if (status === 'loading') return <div className={css.imageLoading}></div>;
  if (status === 'error')
    return <div className={css.imageLoading}>Error: {error.message}</div>;
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

const ShopDetails: React.FC<{ shopID: number }> = ({ shopID }) => {
  const getShopDetails = async () => {
    const response = await axios.get(LINK_GET_SHOP_DETAILS, {
      params: {
        id: shopID,
      },
      withCredentials: true,
    });
    return response.data;
  };

  const { status, data, error } = useQuery<
    'idle' | 'error' | 'loading' | 'success',
    AxiosError,
    { email: string; first_name: string; isVerified: number; last_name: string }
  >(['shopDetails', shopID], getShopDetails);

  if (status === 'loading') {
    return (
      <div className={css.shopDetails}>
        <div className={css.loading}>{''}</div>
        <div className={css.loading}>{''}</div>
        <div className={css.loading}>{''}</div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={css.shopDetails}>
        <div className={css.error}>
          Error: {(error.response?.data as ErrorData).error}
        </div>
      </div>
    );
  }
  return (
    <div className={css.shopDetails}>
      <div>
        <strong>Name:</strong> {`${data?.first_name} ${data?.last_name}`}
      </div>
      <div>
        <strong>Email:</strong> {data?.email}
      </div>
      <div>
        <strong>Not yet verified</strong>
      </div>
    </div>
  );
};

export default function AdminPanel() {
  const [selectedShopID, setSelectedShopID] = useState<number>(-1);
  const { status, data, error, refetch } = useQuery<
    'idle' | 'error' | 'loading' | 'success',
    AxiosError,
    Array<SellerData>
  >({
    queryKey: 'pendingList',
    queryFn: getPendingList,
  });

  const submitHandler = async (newStatus: number) => {
    document.body.style.cursor = 'wait';
    const formData = new FormData();
    formData.append('id', String(selectedShopID));
    formData.append('updated_status', String(newStatus));
    await axios
      .post(LINK_APPROVE_OR_REJECT, formData, { withCredentials: true })
      .then((response) => {
        console.log(response);
        setSelectedShopID(-1);
        refetch();
      })
      .catch((error) => {
        console.log(error);
      });
    document.body.style.cursor = 'default';
  };

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
          status={status}
          data={data}
          error={error || undefined}
        />
        <button
          className={css.btnApprove}
          onClick={(event) => {
            event.preventDefault();
            submitHandler(1);
          }}
        >
          <img src={check} alt="Approve icon" className={css.buttonIcon} />
          Approve
        </button>
        <button
          className={css.btnReject}
          onClick={(event) => {
            event.preventDefault();
            submitHandler(2);
          }}
        >
          <img
            src={reject}
            alt="Reject icon"
            className={`${css.rejectIcon} ${css.buttonIcon}`}
          />
          Reject
        </button>
      </form>
      {selectedShopID !== -1 && (
        <div className={css.shopInfo}>
          <div className={css.shopDetailsAndSelfie}>
            <ShopImage
              resourceType="selfie"
              id={selectedShopID}
              alt="Owner selfie"
              classes={css.shopSelfie}
              imageKey={0}
            />
            <ShopDetails shopID={selectedShopID} />
          </div>
          <h2>Valid IDs:</h2>
          <div className={css.shopIDContainer}>
            <div className={css.shopID}>
              <ShopImage
                resourceType="id1"
                id={selectedShopID}
                alt="Owner ID 1"
                imageKey={1}
              />
            </div>
            <div className={css.shopID}>
              <ShopImage
                resourceType="id2"
                id={selectedShopID}
                alt="Owner ID 2"
                imageKey={2}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
