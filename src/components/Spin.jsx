import React from "react";
import styles from './Spin.css';

function Spin({
	
}) { 
	const loadingLogo = require('../assets/staticIcon/loadingLogo.gif')
	return (
		<div>

			<div className={styles.contentStyle}>
				<div className={styles.contentBackgroundStyle}>
				</div>
				<div className={styles.contentContainerStyle}>

						<div className={styles.containerStyle2}><div className={styles.imgContainerStyle}><img src={'/'+loadingLogo} alt="" className={styles.loadingLogoStyle} /></div></div>

				</div>
			</div>

		</div>
	);
}
export default Spin;

