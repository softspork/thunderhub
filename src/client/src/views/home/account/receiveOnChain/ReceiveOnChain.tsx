import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useCreateAddressMutation } from '../../../../graphql/mutations/__generated__/createAddress.generated';
import QRCode from 'qrcode.react';
import { Copy } from 'react-feather';
import { getErrorContent } from '../../../../utils/error';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
import { mediaWidths } from '../../../../styles/Themes';

const Responsive = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (${mediaWidths.mobile}) {
    flex-direction: column;
  }
`;

const WrapRequest = styled.div`
  overflow-wrap: break-word;
  word-wrap: break-word;
  -ms-word-break: break-all;
  word-break: break-word;
  margin: 24px;
  font-size: 14px;
`;

const QRWrapper = styled.div`
  width: 280px;
  height: 280px;
  margin: 16px;
  background: white;
  padding: 16px;
`;

const Column = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const ReceiveOnChainCard = () => {
  const [received, setReceived] = useState(false);

  const [createAddress, { data, loading }] = useCreateAddressMutation({
    onError: error => toast.error(getErrorContent(error)),
  });

  useEffect(() => {
    data && data.createAddress && setReceived(true);
  }, [data]);

  return (
    <>
      {data && data.createAddress ? (
        <Responsive>
          <QRWrapper>
            <QRCode value={data.createAddress} renderAs={'svg'} size={248} />
          </QRWrapper>
          <Column>
            <WrapRequest>{data.createAddress}</WrapRequest>
            <CopyToClipboard
              text={data.createAddress}
              onCopy={() => toast.success('Address Copied')}
            >
              <ColorButton>
                <Copy size={18} />
                Copy
              </ColorButton>
            </CopyToClipboard>
          </Column>
        </Responsive>
      ) : (
        <ColorButton
          onClick={() => createAddress()}
          disabled={received}
          withMargin={'0 0 0 16px'}
          mobileMargin={'16px 0 0'}
          arrow={true}
          loading={loading}
          mobileFullWidth={true}
        >
          Create Address
        </ColorButton>
      )}
    </>
  );
};
