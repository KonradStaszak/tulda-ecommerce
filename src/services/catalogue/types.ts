import type { Tables } from '../../types/database'

export type CategoryRow = Tables<'categories'>
export type ProductRow = Tables<'products'>
export type ProductCategoryRow = Tables<'product_categories'>
export type ProductVariantRow = Tables<'product_variants'>
export type ProductImageRow = Tables<'product_images'>
