import {
	useCurrentAccount,
	useSignAndExecuteTransactionBlock,
} from '@mysten/dapp-kit';
import React, { useState } from 'react';
import { TransactionBlock } from "@mysten/sui.js/transactions"; 

// const donateAmount : number = 1000;
interface DonateButtonProps {
    org_id : string
}

const DonateButton : React.FC<DonateButtonProps>= ({ org_id }) => {
	const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock();
    const [donateAmount, setDonateAmount] = useState(1000); // Default donate amount
	const currentAccount = useCurrentAccount();
 
    const donate = () => {
        let txb = new TransactionBlock();
        const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(donateAmount)]);
        
        txb.moveCall({
            target: '0x2da8cd5a514de9150ed7019e1e1ccf6ec4f23f272162a8389813d5a56fd1b151::organization::donate', 
            arguments: [txb.object(org_id), coin]
        });
        return txb;
    }

	return (
		<div style={{ padding: 20 }}>
            {!currentAccount && (
                <h2> Connect Wallet to Donate</h2>
            )}

			{currentAccount && (
				<>
                    <div className="flex">
                        <button className="bg-blue-500 rounded 5px">
                        <label htmlFor="donateAmount">Donate Amount: </label>
                        <input
                        type="number"
                        id="donateAmount"
                        value={donateAmount}
                        onChange={(e) => setDonateAmount(parseInt(e.target.value, 10))}
                        />
                        </button>
                        
                    
                        <div>
                            <button
                                onClick={() => {
                                    signAndExecuteTransactionBlock(
                                        {
                                            transactionBlock: donate(),
                                            chain: 'sui:testnet',
                                        },
                                        {
                                            onSuccess: (result) => {
                                                console.log('executed transaction block', result);
                                            },
                                            onError: (res) => {
                                                console.log(res);
                                            }
                                        },
                                    );
                                }}

                            className="bg-blue-400 hover:bg-blue-700 text-white font-bold rounded-lg py-10% px-5% rounded m-4 sm:text-md md:text-lg lg:text-xl">
                                DONATE
                            </button>
                        </div>
                    </div>
				</>
			)}
		</div>
	);
}

export default DonateButton;