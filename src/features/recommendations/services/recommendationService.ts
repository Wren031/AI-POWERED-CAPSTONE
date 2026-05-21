// import { supabase } from "../../../lib/supabase";
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

//         tbl_condition (
//           id,
//           name,
//           created_at
//         ),

//         tbl_recommendation_products (
//           tbl_products (
//             id,
//             product_name,
//             type,
//             price,
//             image_url,
//             instructions,
//             usage
//           )
//         ),

//         tbl_recommendation_lifestyle_tips (
//           tbl_lifestyle_tips (
//             id,
//             category,
//             title,
//             description
//           )
//         )
//       `);

//     if (error) throw error;
//     if (!data) return [];

//     return data.map((rec: any) => ({
//       id: rec.id,
//       severity: rec.severity,
//       treatment: rec.treatment,
//       precautions: rec.precautions,
//       createdAt: rec.created_at,
//       usage_duration: rec.usage_duration,
      
//       condition: {
//         id: rec.tbl_condition?.id,
//         name: rec.tbl_condition?.name,
//         created_at: rec.tbl_condition?.created_at,
//       },

//       products:
//         rec.tbl_recommendation_products?.map((rp: any) => ({
//           id: rp.tbl_products.id,
//           product_name: rp.tbl_products.product_name,
//           type: rp.tbl_products.type,
//           price: rp.tbl_products.price,
//           image_url: rp.tbl_products.image_url,
//           instructions: rp.tbl_products.instructions,
//           usage: rp.tbl_products.usage,
//         })) || [],

//       lifestyleTips:
//         rec.tbl_recommendation_lifestyle_tips?.map((lt: any) => ({
//           id: lt.tbl_lifestyle_tips.id,
//           category: lt.tbl_lifestyle_tips.category,
//           title: lt.tbl_lifestyle_tips.title,
//           description: lt.tbl_lifestyle_tips.description,
//         })) || [],
//     }));
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
//         usage_duration: 
//       })
//       .select()
//       .single();

//     if (error) throw error;

//     // 🧴 PRODUCTS
//     if (rec.products?.length) {
//       const productLinks = rec.products.map((p) => ({
//         recommendation_id: data.id,
//         product_id: p.id,
//       }));

//       const { error: productError } = await supabase
//         .from("tbl_recommendation_products")
//         .insert(productLinks);

//       if (productError) throw productError;
//     }

//     // 🌿 LIFESTYLE TIPS (FIXED)
//     if (rec.lifestyleTips?.length) {
//       const tipLinks = rec.lifestyleTips.map((t) => ({
//         recommendation_id: data.id,
//         lifestyle_tip_id: t.id,
//       }));

//       const { error: lifestyleError } = await supabase
//         .from("tbl_recommendation_lifestyle_tips")
//         .insert(tipLinks);

//       if (lifestyleError) throw lifestyleError;
//     }

//     return {
//       ...rec,
//       id: data.id,
//       createdAt: data.created_at,
//     };
//   },

//   // =========================
//   // 🔄 UPDATE
//   // =========================
//   async update(rec: Recommendation): Promise<Recommendation> {

//     const { error } = await supabase
//       .from("tbl_recommendations")
//       .update({
//         condition_id: rec.condition.id,
//         severity: rec.severity,
//         treatment: rec.treatment,
//         precautions: rec.precautions,
//       })
//       .eq("id", rec.id);

//     if (error) throw error;

//     // 🧴 PRODUCTS SYNC
//     await supabase
//       .from("tbl_recommendation_products")
//       .delete()
//       .eq("recommendation_id", rec.id);

//     if (rec.products?.length) {
//       const productLinks = rec.products.map((p) => ({
//         recommendation_id: rec.id,
//         product_id: p.id,
//       }));

//       const { error: productError } = await supabase
//         .from("tbl_recommendation_products")
//         .insert(productLinks);

//       if (productError) throw productError;
//     }

//     // 🌿 LIFESTYLE TIPS SYNC (FIXED)
//     await supabase
//       .from("tbl_recommendation_lifestyle_tips")
//       .delete()
//       .eq("recommendation_id", rec.id);

//     if (rec.lifestyleTips?.length) {
//       const tipLinks = rec.lifestyleTips.map((t) => ({
//         recommendation_id: rec.id,
//         lifestyle_tip_id: t.id,
//       }));

//       const { error: lifestyleError } = await supabase
//         .from("tbl_recommendation_lifestyle_tips")
//         .insert(tipLinks);

//       if (lifestyleError) throw lifestyleError;
//     }

//     return rec;
//   },

//   // =========================
//   // ❌ DELETE
//   // =========================
//   async delete(id: number): Promise<void> {
//     const { error } = await supabase
//       .from("tbl_recommendations")
//       .delete()
//       .eq("id", id);

//     if (error) throw error;
//   },
// };


import { supabase } from "../../../lib/supabase";
import type { Recommendation } from "../types/Recommendation";

export const recommendationService = {

  // =========================
  // 📥 GET ALL
  // =========================
  async getAll(): Promise<Recommendation[]> {
    const { data, error } = await supabase
      .from("tbl_recommendations")
      .select(`
        id,
        severity,
        treatment,
        precautions,
        created_at,

        tbl_condition (
          id,
          name,
          created_at
        ),

        tbl_recommendation_products (
          tbl_products (
            id,
            product_name,
            type,
            price,
            image_url,
            instructions,
            usage
          )
        ),

        tbl_recommendation_lifestyle_tips (
          tbl_lifestyle_tips (
            id,
            category,
            title,
            description
          )
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
      
      condition: {
        id: rec.tbl_condition?.id,
        name: rec.tbl_condition?.name,
        created_at: rec.tbl_condition?.created_at,
      },

      products:
        rec.tbl_recommendation_products?.map((rp: any) => ({
          id: rp.tbl_products.id,
          product_name: rp.tbl_products.product_name,
          type: rp.tbl_products.type,
          price: rp.tbl_products.price,
          image_url: rp.tbl_products.image_url,
          instructions: rp.tbl_products.instructions,
          usage: rp.tbl_products.usage,
        })) || [],

      lifestyleTips:
        rec.tbl_recommendation_lifestyle_tips?.map((lt: any) => ({
          id: lt.tbl_lifestyle_tips.id,
          category: lt.tbl_lifestyle_tips.category,
          title: lt.tbl_lifestyle_tips.title,
          description: lt.tbl_lifestyle_tips.description,
        })) || [],
    }));
  },

  // =========================
  // ➕ CREATE
  // =========================
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

    // 🧴 PRODUCTS
    if (rec.products?.length) {
      const productLinks = rec.products.map((p) => ({
        recommendation_id: data.id,
        product_id: p.id,
      }));

      const { error: productError } = await supabase
        .from("tbl_recommendation_products")
        .insert(productLinks);

      if (productError) throw productError;
    }

    // 🌿 LIFESTYLE TIPS
    if (rec.lifestyleTips?.length) {
      const tipLinks = rec.lifestyleTips.map((t) => ({
        recommendation_id: data.id,
        lifestyle_tip_id: t.id,
      }));

      const { error: lifestyleError } = await supabase
        .from("tbl_recommendation_lifestyle_tips")
        .insert(tipLinks);

      if (lifestyleError) throw lifestyleError;
    }

    return {
      ...rec,
      id: data.id,
      createdAt: data.created_at,
    };
  },

  // =========================
  // 🔄 UPDATE
  // =========================
  async update(rec: Recommendation): Promise<Recommendation> {
    const { error } = await supabase
      .from("tbl_recommendations")
      .update({
        condition_id: rec.condition.id,
        severity: rec.severity,
        treatment: rec.treatment,
        precautions: rec.precautions,
      })
      .eq("id", rec.id);

    if (error) throw error;

    // 🧴 PRODUCTS SYNC
    await supabase
      .from("tbl_recommendation_products")
      .delete()
      .eq("recommendation_id", rec.id);

    if (rec.products?.length) {
      const productLinks = rec.products.map((p) => ({
        recommendation_id: rec.id,
        product_id: p.id,
      }));

      const { error: productError } = await supabase
        .from("tbl_recommendation_products")
        .insert(productLinks);

      if (productError) throw productError;
    }

    // 🌿 LIFESTYLE TIPS SYNC
    await supabase
      .from("tbl_recommendation_lifestyle_tips")
      .delete()
      .eq("recommendation_id", rec.id);

    if (rec.lifestyleTips?.length) {
      const tipLinks = rec.lifestyleTips.map((t) => ({
        recommendation_id: rec.id,
        lifestyle_tip_id: t.id,
      }));

      const { error: lifestyleError } = await supabase
        .from("tbl_recommendation_lifestyle_tips")
        .insert(tipLinks);

      if (lifestyleError) throw lifestyleError;
    }

    return rec;
  },

  // =========================
  // ❌ DELETE
  // =========================
  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from("tbl_recommendations")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};