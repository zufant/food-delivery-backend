
export class CreateOrderDto {
    user_id: number;
    restaurant_id: number;
    items: { menu_item_id: number; quantity: number }[];  
  }
  