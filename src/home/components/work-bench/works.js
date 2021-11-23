const cluesImg = require('../../../assets/images/clues.png')
const customerImg = require('../../../assets/images/customer.png')
const orderImg = require('../../../assets/images/order.png')
const driverImg = require('../../../assets/images/driver.png')
const lostImg = require('../../../assets/images/lost.png')
const deliveryImg = require('../../../assets/images/delivery.png')
export default [
	{
		name: '线索大厅', path: 'Clues', image: cluesImg,
		role: {
			'rolePartnerSale': true,
			'rolePartnerAdmin': true,
			'rolePartnerSaleManager': true
		}
	},
	{
		name: '新建客户', path: 'Customers', image: customerImg,
		role: {
			'rolePartnerSale': true,
			'rolePartnerAdmin': true,
			'rolePartnerSaleManager': true
		}
	},
	{
		name: '试驾管理', path: 'Driver', image: driverImg,
		role: {
			'rolePartnerSale': true,
			'rolePartnerAdmin': true,
			'rolePartnerTestDrive':true
		}
	},
	{
		name: '订单管理', path: 'OrderInquire', image: orderImg,
		role: {
			'rolePartnerSale': true,
			'rolePartnerAdmin': true,
			'rolePartnerSaleManager': true
		}
	},
	{
		name: '交车管理', path: 'Delivery', image: deliveryImg,
		role: {
			'rolePartnerAdmin': true,
			'rolePartnerHandleVehicle':true
		}
	},
	{
		name: '战败管理', path: 'Lost', image: lostImg,
		role: {
			'rolePartnerAdmin': true,
			'rolePartnerSaleManager': true,
			'rolePartnerManager':true
		}
	}
]
