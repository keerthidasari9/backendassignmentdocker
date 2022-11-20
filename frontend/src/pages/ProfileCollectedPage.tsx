import { Button, Input } from 'antd'
import { useReactiveVar } from '@apollo/client'
import React, { useState, useContext } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import styled from 'styled-components'
import {AppContext} from '../contexts';
import { colors } from '../styles/variables'
import { updateProfile } from '../services/UserService';
import { FooterCardMarketplace } from '../components/marketplace/FooterCardMarketplace'
import { FooterCardMarketplaceLoading } from '../components/marketplace/FooterCardMarketplaceLoading'
import EmptyState from '../components/shared/EmptyState'
import { CardTemplate } from '../components/shared/template/cards/CardTemplate'
import {
  marketplaceFiltersVar,
  sortingDirectionMarketplaceItemsVar,
  sortingFieldMarketplaceItemsVar
} from '../graphql/variables/MarketplaceVariable'
import { useChainConfig, useGlobalConfig } from '../hooks/ConfigHook'
import { useMarketplaceNfts } from '../hooks/MarketplaceHooks'
import { validate, emailValidate } from '../services/ValidationService';
import { ProfilePageTemplate } from './shared/templates/ProfilePageTemplate'
import { SettingsPageTemplate } from './shared/templates/SettingsPageTemplate'

export default function ProfileCollectedPage() {
  const sortingField = useReactiveVar(sortingFieldMarketplaceItemsVar)
  const sortingDirection = useReactiveVar(sortingDirectionMarketplaceItemsVar)
  const { paginationLimit } = useGlobalConfig()
  const { chainId } = useChainConfig()
  const marketplaceFilter = useReactiveVar(marketplaceFiltersVar)

  const { loading, hasMore, loadMore, nfts } = useMarketplaceNfts(marketplaceFilter, sortingDirection, sortingField, paginationLimit)

  const {user, setUser} = useContext(AppContext);
  const [username, setUsername] = useState<string>(user.username)
  const [email, setEmail] = useState<string>(user.email)
  const [firstname, setFirstname] = useState<string>(user.first_name)
  const [lastname, setLastname] = useState<string>(user.last_name)
  const [password, setPassword] = useState<string>('')
  const [confirm_password, setConfirmPassword] = useState<string>('')
  const [phone, setPhone] = useState<string>(user.phone)
  const [paypal, setPaypal] = useState<string>(user.paypal)


  const handleKeyPress = (e: any, target: string) => {
    if(e.key === 'Enter'){
      document.getElementById(target).focus();           
    }
  }

  const handleSubmit = async () => {
    if(!validate('Username', username)) return;
    if(!validate('Email', email)) return;
    if(!emailValidate(email)) return;
    if(!validate('Firstname', firstname)) return;
    if(!validate('Lastname', lastname)) return;
    if(!validate('Password', password)) return;
    if(!validate('Confirm Password', confirm_password)) return;
    if(!validate('Paypal Address', paypal)) return;
    if(!emailValidate(paypal)) return;
    if(password !== confirm_password) return;

    let data = {
      username: username, 
      password: password, 
      email: email, 
      first_name: firstname, 
      last_name: lastname, 
      phone: phone,
      paypal: paypal};

    console.log(data);
    
    const userdata = await updateProfile(data);
    console.log(userdata);
    if(userdata !== {}){    
      setUser({
        authenticated: true,
        username: userdata['username'], 
        password: userdata['password'],
        email: userdata['email'],
        exp: userdata['exp'],
        first_name: userdata['first_name'],
        last_name: userdata['last_name'],
        phone: userdata['phone'],
        private_key: userdata['private_key'],
        public_key: userdata['public_key'],
        profile_cover: userdata['profile_cover'],
        profile_image: userdata['profile_image'],
        paypal: userdata['paypal'],
        role: userdata['role'],
        status: userdata['status']
      })
    }
  }

  const loader = (
    <S.CardsContainer>
      {[...Array(paginationLimit)].map(() => (
        <CardTemplate key={`loading-${Math.random()}`} loading >
          <FooterCardMarketplaceLoading loading />
        </CardTemplate>
      ))}
    </S.CardsContainer>
  )

  return (
    <ProfilePageTemplate> 
      {!loading && !nfts.length && <EmptyState />}
      <InfiniteScroll next={loadMore} hasMore={hasMore} loader={loader} dataLength={nfts.length}>
        <S.CardsContainer>
          {nfts.map(nftItem => {
            const image = String(nftItem?.metadata?.image)
            return (
              <CardTemplate
                key={`${nftItem.id}`}
                image={image}
                animation_url={nftItem?.metadata?.animation_url}
                name={String(nftItem?.metadata?.name)}
                isBoxNftCount={nftItem?.nftCount}
                collectionAddress={nftItem?.target.collection.id}
                url={`/marketplace/${nftItem.id}`}>
                <FooterCardMarketplace erc20Item={nftItem} chainId={Number(chainId)} />
              </CardTemplate>
            )
          })}
        </S.CardsContainer>
      </InfiniteScroll>
      <header>General Settings</header>
      <div style={{width: '100%', padding: '7px', borderRadius: '5px', cursor: 'pointer'}}>
        <S.InputDiv>
          User Name
          <S.Input maxLength={60} value={username} placeholder="Enter Username" onChange={(event:any) => setUsername(event.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'email')} />
        </S.InputDiv>
        <S.InputDiv>
          Email
          <S.Input maxLength={60} id='email' value={email} placeholder="Enter Email" onChange={(event:any) => setEmail(event.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'firstname')} />
        </S.InputDiv>
        <S.InputDiv>
          First Name
          <S.Input maxLength={60} id='firstname' value={firstname} placeholder="Enter FirstName" onChange={(event:any) => setFirstname(event.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'lastname')} />
        </S.InputDiv>
        <S.InputDiv>
          Last Name
          <S.Input maxLength={60} id='lastname' value={lastname} placeholder="Enter LastName" onChange={(event:any) => setLastname(event.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'phone')} />
        </S.InputDiv>
        <S.InputDiv>
          Password
          <S.Input maxLength={60} id='password' value={password} placeholder="Enter Password" onChange={(event:any) => setPassword(event.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'password')} />
        </S.InputDiv>
        <S.InputDiv>
          Confirm Password
          <S.Input maxLength={60} id='confirm_password' value={confirm_password} placeholder="Enter Confirm Password" onChange={(event:any) => setConfirmPassword(event.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'confirm_password')} />
        </S.InputDiv>
        <S.InputDiv>
          Phone Number
          <S.Input maxLength={60} id='phone' value={phone} placeholder="Enter Phone Number" onChange={(event:any) => setPhone(event.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'paypal')} />
        </S.InputDiv>
        <S.InputDiv>
          Paypal Address
          <S.Input maxLength={60} id='paypal' value={paypal} placeholder="Enter Paypal Address" onChange={(event:any) => setPaypal(event.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'update')} />
        </S.InputDiv>
      </div>
      <div style={{width: '100%'}}>
        <S.Button id='update' onClick={handleSubmit}>
          Save
        </S.Button>
      </div>
    </ProfilePageTemplate>
  )
}

export const S = {
  CardsContainer: styled.div`
    display: grid;
    grid-template-columns: repeat(1, 1fr);
      justify-content: flex-start;
    align-items: flex-start;

    > div:last-of-type {
      margin-bottom: 4vw;
    }

    @media (min-width: ${props => props.theme.viewport.tablet}) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: ${props => props.theme.viewport.desktop}) {
      grid-template-columns: repeat(3, 1fr);

      > div:last-of-type {
        margin-bottom: 4vw;
      }
    }

    @media (min-width: ${props => props.theme.viewport.desktopXl}) {
      grid-template-columns: repeat(4, 1fr);
      gap: 2vw;

      > div:last-of-type {
        margin-bottom: 2vw;
      }
    }
  `,
  InputDiv: styled.div `
    width: 100%;
    padding: 10px 20px 10px 20px;
    display: inline-block;
    @media (min-width: ${props => props.theme.viewport.tablet}) {
      width: 50%;
    }
  `,
  Input: styled(Input) `
    display: block;
    width: 100%;
    height: calc(1.5em + 0.75rem + 2px);
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    color: ${props=>props.theme.gray['4']};
    background-color: ${props=>props.theme.gray['1']};
    background-clip: padding-box;
    border: 1px solid ${props=>props.theme.gray['2']};
    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    `,
  Button: styled(Button)`
    display: inline-block !important;
    margin-left: 27px !important;
    margin-bottom: 20px;
    background-color: ${colors.red1};
    color: ${colors.white};
    border-radius: 5px !important;
    padding: 3px 15px 5px 15px !important;
    cursor: pointer !important;

    &:hover,
    &:active,
    &:focus {
      background-color: ${colors.red2};
      opacity: 0.8;
    }
  `
}
