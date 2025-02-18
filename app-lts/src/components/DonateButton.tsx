import {
	useCurrentAccount,
	useSignAndExecuteTransactionBlock,
} from '@mysten/dapp-kit';
import React, { useState } from 'react';
import { TransactionBlock } from "@mysten/sui.js/transactions"; 
import './DonateButton.css';

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

        //api call to load user data, if empty --> 
        //const [user] = txb.moveCall
        //txb.transferObject(user, currentAccount.address);

        //else 

        const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(donateAmount)]);
        
        txb.moveCall({
            target: '0xd4ef611945e795df3fdfcc1bb3b5147ca90262cd603d0a39b0813eba74715ec0::organization::donate', 
            arguments: [txb.object(org_id), coin]
        });
        return txb;
    }

	return (
		<div style={{ padding: 20 }}>
            {!currentAccount && (
                <h2 className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-10% px-5% m-4 sm:text-md md:text-lg lg:text-xl p-2"> Connect Wallet to Donate</h2>
            )}

			{currentAccount && (
				<>
                    <div className="flex">
                        <button className="bg-blue-500">
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

                            className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-10% px-5% m-4 sm:text-md md:text-lg lg:text-xl p-2">
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