import type { Severity } from "./Severity";
import type { Products } from "../../products/types/Products";
import type { SkinCondition } from "../../condition/type/SkinCondition";
import type { LifestyleTip } from "../../lifestyle/types/Lifestyle";

export interface Recommendation {
    id: number;
    condition: SkinCondition;
    severity: Severity;
    treatment: string;
    products: Products[];
    precautions: string;
    lifestyleTips: LifestyleTip[];
    createdAt: string;
}