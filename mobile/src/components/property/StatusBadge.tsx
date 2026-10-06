import { Badge } from '../ui/Badge'
import { COLORS } from '../../config/constants'

export function StatusBadge({ type }: { type: string }) {
  const isBuy = type.toLowerCase() === 'buy'
  return <Badge label={isBuy ? 'BUY' : 'RENT'} backgroundColor={isBuy ? COLORS.buyColor : COLORS.rentColor} />
}
