// emailVerificationTemplate.js

const emailVerificationTemplate = (verificationLink,username) => `
<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
	<title></title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!--><!--<![endif]-->
	<style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 0;
		}

		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit
		}

		.desktop_hide,
		.desktop_hide table {
			mso-hide: all;
			display: none;
			max-height: 0px;
			overflow: hidden;
		}

		.image_block img+div {
			display: none;
		}

		@media (max-width:700px) {
			.desktop_hide table.icons-inner {
				display: inline-block !important;
			}

			.icons-inner {
				text-align: center;
			}

			.icons-inner td {
				margin: 0 auto;
			}

			.mobile_hide {
				display: none;
			}

			.row-content {
				width: 100% !important;
			}

			.stack .column {
				width: 100%;
				display: block;
			}

			.mobile_hide {
				min-height: 0;
				max-height: 0;
				max-width: 0;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide,
			.desktop_hide table {
				display: table !important;
				max-height: none !important;
			}

			.row-1 .column-1 .block-3.heading_block h1 {
				font-size: 12px !important;
			}

			.row-1 .column-1 .block-4.paragraph_block td.pad>div,
			.row-3 .column-1 .block-4.paragraph_block td.pad>div {
				font-size: 13px !important;
			}

			.row-1 .column-1 .block-2.icons_block .alignment {
				text-align: center !important;
			}

			.row-1 .column-1 .block-2.icons_block .icons-inner a,
			.row-1 .column-1 .block-2.icons_block .icons-inner td {
				font-size: 19px !important;
			}

			.row-3 .column-1 .block-3.paragraph_block td.pad>div {
				font-size: 16px !important;
			}

			.row-2 .column-1 .block-1.button_block a,
			.row-2 .column-1 .block-1.button_block div,
			.row-2 .column-1 .block-1.button_block span {
				font-size: 14px !important;
				line-height: 28px !important;
			}
		}
	</style>
</head>

<body style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
	<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;">
		<tbody>
			<tr>
				<td>
					<table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; background-size: auto;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto; color: #000000; width: 680px; margin: 0 auto;" width="680">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<div class="spacer_block block-1" style="height:35px;line-height:35px;font-size:1px;">&#8202;</div>
													<table class="icons_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad" style="vertical-align: middle; color: #000000; font-family: inherit; font-size: 18px; text-align: center;">
																<table class="alignment" cellpadding="0" cellspacing="0" role="presentation" align="center" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																	<tr>
																		<td style="vertical-align: middle; text-align: center; padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 5px;"><img class="icon" src="https://res.cloudinary.com/dhxhiixtj/image/upload/v1710777578/companyProfile/uwnrgikyon74jjyb5j9s.png" alt="Edlernity" height="64" width="64" align="center" style="display: block; height: auto; margin: 0 auto; border: 0;"></td>
																	</tr>
																</table>
															</td>
														</tr>
													</table>
													<table class="heading_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad" style="padding-left:20px;padding-right:20px;text-align:center;width:100%;">
																<h1 style="margin: 0; color: #221a70; direction: ltr; font-family: Lucida Sans Unicode, Lucida Grande, Lucida Sans, Geneva, Verdana, sans-serif; font-size: 29px; font-weight: normal; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 34.8px;"><span class="tinyMce-placeholder">"EdLernity-Where knowledge meets eternity"</span></h1>
															</td>
														</tr>
													</table>
													<table class="paragraph_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-bottom:15px;padding-left:20px;padding-right:20px;padding-top:15px;">
																<div style="color:#737373;font-family:Lucida Sans Unicode, Lucida Grande, Lucida Sans, Geneva, Verdana, sans-serif;font-size:14px;line-height:200%;text-align:left;mso-line-height-alt:28px;">
																	<p style="margin: 0;">Welcome, ${username}!</p>
																	<p style="margin: 0;">At EdLernity, we believe that learning should adapt to fit your life, not the other way around.Join us today and unlock your full potential with the freedom to learn on your own terms.</p>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px; margin: 0 auto;" width="680">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="button_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:10px;padding-top:10px;text-align:center;">
																<div class="alignment" align="center"><!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${verificationLink}" style="height:46px;width:146px;v-text-anchor:middle;" arcsize="48%" strokeweight="0.75pt" strokecolor="#F07867" fillcolor="#0068a5">
<w:anchorlock/>
<v:textbox inset="0px,0px,5px,0px">
<center style="color:#ffffff; font-family:Verdana, sans-serif; font-size:16px">
<![endif]--><a href="${verificationLink}" target="_blank" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#0068a5;border-radius:20px;width:auto;border-top:1px solid #F07867;font-weight:undefined;border-right:1px solid #F07867;border-bottom:1px solid #F07867;border-left:1px solid #F07867;padding-top:4px;padding-bottom:4px;font-family:Lucida Sans Unicode, Lucida Grande, Lucida Sans, Geneva, Verdana, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:45px;padding-right:50px;font-size:16px;display:inline-block;letter-spacing:1px;"><span style="word-break: break-word; line-height: 32px;">Verify</span></span></a><!--[if mso]></center></v:textbox></v:roundrect><![endif]--></div>
															</td>
														</tr>
													</table>
													<div class="spacer_block block-2" style="height:40px;line-height:40px;font-size:1px;">&#8202;</div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #6483f6; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/3011/bg_blue.png'); background-position: center top; background-repeat: no-repeat;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px; margin: 0 auto;" width="680">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<div class="spacer_block block-1 mobile_hide" style="height:40px;line-height:40px;font-size:1px;">&#8202;</div>
													<div class="spacer_block block-2" style="height:40px;line-height:40px;font-size:1px;">&#8202;</div>
													<table class="paragraph_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-bottom:15px;padding-left:20px;padding-right:10px;">
																<div style="color:#ffffff;font-family:Lucida Sans Unicode, Lucida Grande, Lucida Sans, Geneva, Verdana, sans-serif;font-size:24px;line-height:150%;text-align:center;mso-line-height-alt:36px;">
																	<p style="margin: 0; word-break: break-word;"><span>"EdLernity-Best Education Platform"</span></p>
																</div>
															</td>
														</tr>
													</table>
													<table class="paragraph_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-bottom:15px;padding-left:20px;padding-right:20px;">
																<div style="color:#f5f5f5;font-family:Lucida Sans Unicode, Lucida Grande, Lucida Sans, Geneva, Verdana, sans-serif;font-size:14px;line-height:180%;text-align:center;mso-line-height-alt:25.2px;">
																	<p style="margin: 0;">Are you looking to enhance your skills, embark on a new career path, or simply indulge your curiosity? Look no further than Edlernity – your gateway to a diverse array of courses designed to cater to your learning needs. With Edlernity, you can explore a wide range of subjects, from technology and business to arts and humanities. Here’s a glimpse into the world of learning opportunities waiting for you at Edlernity.</p>
																</div>
															</td>
														</tr>
													</table>
													<div class="spacer_block block-5" style="height:40px;line-height:40px;font-size:1px;">&#8202;</div>
													<div class="spacer_block block-6 mobile_hide" style="height:40px;line-height:40px;font-size:1px;">&#8202;</div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px; margin: 0 auto;" width="680">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-bottom:15px;padding-left:20px;padding-right:10px;">
																<div style="color:#080909;font-family:Lucida Sans Unicode, Lucida Grande, Lucida Sans, Geneva, Verdana, sans-serif;font-size:24px;line-height:150%;text-align:center;mso-line-height-alt:36px;">
																	<p style="margin: 0;">Explore our Lifetime Subscription Plan</p>
																</div>
															</td>
														</tr>
													</table>
													<table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-bottom:15px;padding-left:20px;padding-right:20px;">
																<div style="color:#737373;font-family:Lucida Sans Unicode, Lucida Grande, Lucida Sans, Geneva, Verdana, sans-serif;font-size:12px;line-height:180%;text-align:center;mso-line-height-alt:21.6px;">
																	<p style="margin: 0;">WE'RE THRILLED TO ANNOUNCE OUR LATEST COURSE PACKAGE OFFER DESIGNED TO SUPERCHARGE YOUR LEARNING JOURNEY! DIVE INTO A WORLD OF KNOWLEDGE WITH OUR COMPREHENSIVE PACKAGE, CRAFTED TO EMPOWER YOU WITH THE SKILLS AND INSIGHTS YOU NEED TO SUCCEED. STAY TUNED FOR MORE DETAILS ON HOW YOU CAN SEIZE THIS INCREDIBLE OPPORTUNITY!</p>
																</div>
															</td>
														</tr>
													</table>
													<div class="spacer_block block-3" style="height:20px;line-height:20px;font-size:1px;">&#8202;</div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					
				</td>
			</tr>
		</tbody>
	</table><!-- End -->
</body>

</html>
`;

module.exports = emailVerificationTemplate;
