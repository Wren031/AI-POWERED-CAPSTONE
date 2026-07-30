

// import { supabase } from "../../../lib/supabase";
// import type { LifestyleTip } from "../../lifestyle/types/Lifestyle";
// import type { Products } from "../../products/types/Products";
// import type { Recommendation } from "../types/Recommendation";

// export const recommendationService = {
//   // =========================
//   // 📥 GET ALL
//   // =========================
//   async getAll(): Promise<Recommendation[]> {
//     const { data, error } = await supabase
//       .from("tbl_recommendations")
//       .select(`
//         id,
//         severity,
//         treatment,
//         precautions,
//         created_at,
//         tbl_condition (id, name, created_at),
//         tbl_recommendation_products (
//           tbl_products (id, product_name, type, price, image_url, instructions, usage)
//         ),
//         tbl_recommendation_lifestyle_tips (
//           tbl_lifestyle_tips (id, category, title, description)
//         )
//       `);

//     if (error) throw error;
//     if (!data) return [];

// // ... inside getAll() mapping
// return data.map((rec: any) => {
//   // 🛡️ Deduplicate and cast to Products[]
//   const rawProducts = rec.tbl_recommendation_products?.map((rp: any) => rp.tbl_products) || [];
//   const uniqueProducts: Products[] = Array.from(
//     new Map(rawProducts.filter(Boolean).map((p: any) => [p.id, p])).values()
//   ) as Products[]; // Explicitly tell TS these are Products

//   // 🛡️ Deduplicate and cast to LifestyleTip[]
//   const rawTips = rec.tbl_recommendation_lifestyle_tips?.map((lt: any) => lt.tbl_lifestyle_tips) || [];
//   const uniqueTips: LifestyleTip[] = Array.from(
//     new Map(rawTips.filter(Boolean).map((t: any) => [t.id, t])).values()
//   ) as LifestyleTip[]; // Explicitly tell TS these are LifestyleTips

//   return {
//     id: rec.id,
//     severity: rec.severity,
//     treatment: rec.treatment,
//     precautions: rec.precautions,
//     createdAt: rec.created_at,
//     condition: {
//       id: rec.tbl_condition?.id,
//       name: rec.tbl_condition?.name,
//       created_at: rec.tbl_condition?.created_at,
//     },
//     products: uniqueProducts,
//     lifestyleTips: uniqueTips,
//   };
// });
//   },

//   // =========================
//   // ➕ CREATE
//   // =========================
//   async create(rec: Recommendation): Promise<Recommendation> {
//     const { data, error } = await supabase
//       .from("tbl_recommendations")
//       .insert({
//         condition_id: rec.condition.id,
//         severity: rec.severity,
//         treatment: rec.treatment,
//         precautions: rec.precautions,
//       })
//       .select()
//       .single();

//     if (error) throw error;

//     // 🧴 PRODUCTS
//     if (rec.products?.length) {
//       // 🛡️ Fix: Ensure we only insert unique IDs
//       const uniqueProductIds = [...new Set(rec.products.map(p => p.id))];
//       const productLinks = uniqueProductIds.map((id) => ({
//         recommendation_id: data.id,
//         product_id: id,
//       }));

//       const { error: productError } = await supabase
//         .from("tbl_recommendation_products")
//         .insert(productLinks);

//       if (productError) throw productError;
//     }

//     // 🌿 LIFESTYLE TIPS
//     if (rec.lifestyleTips?.length) {
//       // 🛡️ Fix: Ensure we only insert unique IDs
//       const uniqueTipIds = [...new Set(rec.lifestyleTips.map(t => t.id))];
//       const tipLinks = uniqueTipIds.map((id) => ({
//         recommendation_id: data.id,
//         lifestyle_tip_id: id,
//       }));

//       const { error: lifestyleError } = await supabase
//         .from("tbl_recommendation_lifestyle_tips")
//         .insert(tipLinks);

//       if (lifestyleError) throw lifestyleError;
//     }

//     return { ...rec, id: data.id, createdAt: data.created_at };
//   },

//   // =========================
//   // 🔄 UPDATE
//   // =========================
// // recommendationService.ts -> update method

// async update(rec: Recommendation): Promise<Recommendation> {
//   if (!rec.id) throw new Error("Missing Recommendation ID for update");

//   // 1. Update the main table
//   const { error: mainError } = await supabase
//     .from("tbl_recommendations")
//     .update({
//       condition_id: rec.condition.id,
//       severity: rec.severity,
//       treatment: rec.treatment,
//       precautions: rec.precautions,
//     })
//     .eq("id", rec.id);

//   if (mainError) throw mainError;

//   // 2. Sync Products: Clean old links, then add NEW unique links
//   await supabase.from("tbl_recommendation_products").delete().eq("recommendation_id", rec.id);

//   if (rec.products?.length) {
//     // Deduplicate IDs to prevent DB errors
//     const uniqueProductIds = Array.from(new Set(rec.products.map(p => p.id)));
//     const productLinks = uniqueProductIds.map(pid => ({
//       recommendation_id: rec.id,
//       product_id: pid
//     }));

//     const { error: pErr } = await supabase.from("tbl_recommendation_products").insert(productLinks);
//     if (pErr) throw pErr;
//   }

//   // 3. Sync Tips: Clean old links, then add NEW unique links
//   await supabase.from("tbl_recommendation_lifestyle_tips").delete().eq("recommendation_id", rec.id);

//   if (rec.lifestyleTips?.length) {
//     const uniqueTipIds = Array.from(new Set(rec.lifestyleTips.map(t => t.id)));
//     const tipLinks = uniqueTipIds.map(tid => ({
//       recommendation_id: rec.id,
//       lifestyle_tip_id: tid
//     }));

//     const { error: tErr } = await supabase.from("tbl_recommendation_lifestyle_tips").insert(tipLinks);
//     if (tErr) throw tErr;
//   }

//   return rec;
// },

//   // ... (delete stays the same)
//   async delete(id: number): Promise<void> {
//     const { error } = await supabase
//       .from("tbl_recommendations")
//       .delete()
//       .eq("id", id);
//     if (error) throw error;
//   },
// };

import { supabase } from "../../../lib/supabase";
import type { LifestyleTip } from "../../lifestyle/types/Lifestyle";
import type { Products } from "../../products/types/Products";
import type { Recommendation } from "../types/Recommendation";

export const recommendationService = {

  async getAll(): Promise<Recommendation[]> {
    const { data, error } = await supabase
      .from("tbl_recommendations")
      .select(`
        id, severity, treatment, precautions, created_at,
        tbl_condition (id, name, created_at),
        tbl_recommendation_products (
          tbl_products (id, product_name, type, price, image_url, instructions, usage)
        ),
        tbl_recommendation_lifestyle_tips (
          tbl_lifestyle_tips (id, category, title, description)
        )
      `);

    if (error) throw error;
    if (!data) return [];

    return data.map((rec: any) => ({
      id: rec.id,
      severity: rec.severity,
      treatment: rec.treatment,
      precautions: rec.precautions,
      createdAt: rec.created_at,
      condition: rec.tbl_condition,
      products: Array.from(new Map(
        (rec.tbl_recommendation_products?.map((rp: any) => rp.tbl_products) || [])
          .filter(Boolean)
          .map((p: any) => [p.id, p])
      ).values()) as Products[],
      lifestyleTips: Array.from(new Map(
        (rec.tbl_recommendation_lifestyle_tips?.map((lt: any) => lt.tbl_lifestyle_tips) || [])
          .filter(Boolean)
          .map((t: any) => [t.id, t])
      ).values()) as LifestyleTip[],
    }));
  },

  async create(rec: Recommendation): Promise<Recommendation> {
    const { data, error } = await supabase
      .from("tbl_recommendations")
      .insert({
        condition_id: rec.condition.id,
        severity: rec.severity,
        treatment: rec.treatment,
        precautions: rec.precautions,
      })
      .select()
      .single();

    if (error) throw error;

    if (rec.products?.length) {
      const uniqueProductIds = [...new Set(rec.products.map(p => p.id))];
      const { error: pErr } = await supabase
        .from("tbl_recommendation_products")
        .insert(uniqueProductIds.map(pid => ({
          recommendation_id: data.id,
          product_id: pid,
        })));
      if (pErr) throw pErr;
    }

    if (rec.lifestyleTips?.length) {
      const uniqueTipIds = [...new Set(rec.lifestyleTips.map(t => t.id))];
      const { error: tErr } = await supabase
        .from("tbl_recommendation_lifestyle_tips")
        .insert(uniqueTipIds.map(tid => ({
          recommendation_id: data.id,
          lifestyle_tip_id: tid,
        })));
      if (tErr) throw tErr;
    }

    return { ...rec, id: data.id, createdAt: data.created_at };
  },

  async update(rec: Recommendation): Promise<Recommendation> {
    // Guard: ID must exist and be a valid number
    if (!rec.id || typeof rec.id !== "number") {
      throw new Error(`Update requires a valid numeric ID. Got: ${rec.id}`);
    }

    // Capture as a concrete number so TS and Supabase never see undefined
    const id: number = rec.id;

    // 1. Update main record
    const { error: mainError } = await supabase
      .from("tbl_recommendations")
      .update({
        condition_id: rec.condition.id,
        severity: rec.severity,
        treatment: rec.treatment,
        precautions: rec.precautions,
      })
      .eq("id", id);

    if (mainError) throw mainError;

    // 2. Sync products — always delete then re-insert what remains
    const { error: delProductErr } = await supabase
      .from("tbl_recommendation_products")
      .delete()
      .eq("recommendation_id", id);

    if (delProductErr) throw delProductErr;

    if (rec.products && rec.products.length > 0) {
      const uniqueProductIds = [...new Set(rec.products.map(p => p.id))];
      const { error: insProductErr } = await supabase
        .from("tbl_recommendation_products")
        .insert(uniqueProductIds.map(pid => ({
          recommendation_id: id,
          product_id: pid,
        })));
      if (insProductErr) throw insProductErr;
    }

    // 3. Sync lifestyle tips — always delete then re-insert what remains
    const { error: delTipErr } = await supabase
      .from("tbl_recommendation_lifestyle_tips")
      .delete()
      .eq("recommendation_id", id);

    if (delTipErr) throw delTipErr;

    if (rec.lifestyleTips && rec.lifestyleTips.length > 0) {
      const uniqueTipIds = [...new Set(rec.lifestyleTips.map(t => t.id))];
      const { error: insTipErr } = await supabase
        .from("tbl_recommendation_lifestyle_tips")
        .insert(uniqueTipIds.map(tid => ({
          recommendation_id: id,
          lifestyle_tip_id: tid,
        })));
      if (insTipErr) throw insTipErr;
    }

    return rec;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from("tbl_recommendations")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};