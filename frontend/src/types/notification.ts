export type NotificationType = 'flash_sale' | 'deal_expiring' | 'new_promo' | 'system';

export interface PushNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  createdAt: number;
  dealId?: string;
  dealTitle?: string;
  dealPrice?: number;
  dealOriginalPrice?: number;
  salonName?: string;
  image?: string;
  discountBadge?: string;
  expiresIn?: string;
  isRead: boolean;
}

export type NotificationFilter = 'all' | 'flash_sale' | 'deal_expiring' | 'promo';
