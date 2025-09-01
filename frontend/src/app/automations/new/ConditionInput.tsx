"use client"

import { Condition } from "commons/models/automation";
import React, { useState } from "react";

type Props={
    id: string;
    title: string;
    symbol0: string;
    symbol1: string;
    condition: Condition | null;
    onChange: (condition: Condition)=> void;
}

function ConditionInput(props: Props){
    const DEFAULT_CONDITION: Condition = {
        field: "price0",
        operator: "==",
        value: "0"
    }

    const [condition , setCondition] = useState<Condition>(props.condition || DEFAULT_CONDITION)
    return(
        <>
        
        </>
    )
}

export default ConditionInput;