import { Button, Card, Input, Typography, Form, notification } from "antd";
import { useMemo, useState } from "react";
import contractInfo from "contracts/contractInfo.json";
import Address from "components/Address/Address";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { getEllipsisTxt } from "helpers/formatters";
import { useEffect } from "react";
import Clipboard from 'react-clipboard.js';

const { Text } = Typography;

export default function Contract() {
  const { Moralis } = useMoralis();
  const { contractName, networks, abi } = contractInfo;
  const [responses, setResponses] = useState({});
  const contractAddress = networks[1337].address;

  /**Live query */
  const { data } = useMoralisQuery("Events", (query) => query, [], {
    live: true,
  });

  useEffect(() => console.log("New data: ", data), [data]);

  const displayedContractFunctions = useMemo(() => {
    if (!abi) return [];
    return abi.filter((method) => method["type"] === "function");
  }, [abi]);

  const openNotification = ({ message, description }) => {
    notification.open({
      placement: "bottomRight",
      message,
      description,
      onClick: () => {
        console.log("Notification Clicked!");
      },
    });
  };

  return (
    <div style={{ margin: "auto", display: "flex", gap: "20px", marginTop: "25", width: "70vw" }}>
      <Card
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            Your contract: {contractName}
            <Address avatar="left" copyable address={contractAddress} size={8} />
          </div>
        }
        size="large"
        style={{
          width: "60%",
          boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
          border: "1px solid #e7eaf3",
          borderRadius: "0.5rem",
        }}
      >
        <div>
        After you pay the electricity fee deposit, every month we will deduct USD $0.15 for each kWh of consumption according to the oracle.  
        </div>
        <br/>
        <div>
          You need at least $80 remaining in your account on the 5th of every month or your contract will be canceled.
        </div>
        <br/>
        <div>
          Your contracts
          <ul>
            <li>
              <Clipboard data-clipboard-text="0xe7e3e925e5dcfeaf5c5cebfbc6efd4b404b0e607">
                0xe7e3e925e5dcfeaf5c5cebfbc6efd4b404b0e607
              </Clipboard>
            </li>
          </ul>
        </div>
        <Form.Provider
          onFormFinish={async (name, { forms }) => {
            const params = forms[name].getFieldsValue();

            let isView = false;

            for (let method of abi) {
              if (method.name !== name) continue;
              if (method.stateMutability === "view") isView = true;
            }

            const options = {
              contractAddress,
              functionName: name,
              abi,
              params,
            };

            if (!isView) {
              const tx = await Moralis.executeFunction({ awaitReceipt: false, ...options });
              tx.on("transactionHash", (hash) => {
                setResponses({ ...responses, [name]: { result: null, isLoading: true } });
                openNotification({
                  message: "???? New Transaction",
                  description: `${hash}`,
                });
                console.log("???? New Transaction", hash);
              })
                .on("receipt", (receipt) => {
                  setResponses({ ...responses, [name]: { result: null, isLoading: false } });
                  openNotification({
                    message: "???? New Receipt",
                    description: `${receipt.transactionHash}`,
                  });
                  console.log("???? New Receipt: ", receipt);
                })
                .on("error", (error) => {
                  console.log(error);
                });
            } else {
              Moralis.executeFunction(options).then((response) =>
                setResponses({ ...responses, [name]: { result: response, isLoading: false } })
              );
            }
          }}
        >
          {displayedContractFunctions &&
            displayedContractFunctions.map((item, key) => (
              <Card
                title={`${key + 1}. ${item?.name}`}
                size="small"
                style={{ marginBottom: "20px" }}
              >
                <Form layout="vertical" name={`${item.name}`}>
                  {item.inputs.map((input, key) => (
                    <Form.Item
                      label={`${input.name} (${input.type})`}
                      name={`${input.name}`}
                      required
                      style={{ marginBottom: "15px" }}
                    >
                      <Input defaultValue={input.defaultValue} />
                    </Form.Item>
                  ))}
                  <Form.Item style={{ marginBottom: "5px" }}>
                    <Text style={{ display: "block" }}>
                      {responses[item.name]?.result &&
                        `Response: ${JSON.stringify(responses[item.name]?.result)}`}
                    </Text>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={responses[item?.name]?.isLoading}
                    >
                      {item.stateMutability === "view" ? "Read????" : "Transact????"}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            ))}
        </Form.Provider>
      </Card>
      <Card
        title={"Contract Events"}
        size="large"
        style={{
          width: "40%",
          boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
          border: "1px solid #e7eaf3",
          borderRadius: "0.5rem",
        }}
      >
        {data.map((event, key) => (
          <Card title={"Transfer event"} size="small" style={{ marginBottom: "20px" }}>
            {getEllipsisTxt(event.attributes.transaction_hash, 14)}
          </Card>
        ))}
      </Card>
    </div>
  );
}
