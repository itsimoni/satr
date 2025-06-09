<script>
	import Icon from "$lib/Icon.svelte";
	import { companyName } from "$lib/stores/store";
</script>

<footer
	class="footer bg-neutral text-neutral-content flex w-full items-center justify-center py-4 pl-4 pr-2 font-inter text-xs text-white "
>
	<div class="flex items-center opacity-80 hover:opacity-100 text-center justify-center w-full">
		<Icon classNames="mr-1 h-4" />
		<!-- class="mr-1 h-4" /> -->
		<p>Disclaimer: <br>

SatoshiEliteBot is not a regulated entity and does not operate under the oversight of any U.S. financial authority. The platform is primarily intended for use outside the United States. However, we remain committed to transparency and privacy, complying with applicable global standards such as GDPR and CCPA.

Use in the United States
Intended for Non-U.S. Users: SatoshiEliteBot is designed for use outside the United States. Users accessing the platform from the U.S. do so at their own discretion and are responsible for ensuring compliance with all applicable federal, state, and local laws.

Prohibited States: The platform strictly prohibits access or use by individuals residing in or transacting from states with stringent cryptocurrency regulations, including, but not limited to:

New York (due to the BitLicense requirements)
Hawaii
Any other state requiring specific licenses or approvals to operate cryptocurrency services.
Accidental or Unintended Use in the U.S.: If the platform is accessed or used within the U.S. by mistake or without the knowledge of SatoshiEliteBot, such use is not intended or endorsed. The user assumes all responsibility for compliance with U.S. laws, including reporting obligations to the IRS and adherence to AML/KYC protocols.

Responsibilities and Risks
AML and KYC Compliance: Users must complete mandatory AML and KYC verification to prevent unauthorized access and comply with global standards.
Investment Risks: Cryptocurrency trading is inherently risky and may result in the loss of all invested capital. Users are advised to consult legal and financial professionals before engaging in transactions.
Tax Obligations: Users are responsible for reporting cryptocurrency-related gains, losses, and activities to the appropriate tax authorities.
User Acknowledgment
By accessing and using SatoshiEliteBot, you confirm that you:

Are not a resident of or transacting from a prohibited state.
Understand and accept the risks associated with cryptocurrency trading.
Will comply with all applicable laws and regulations in your jurisdiction.
SatoshiEliteBot reserves the right to restrict access to its platform and services at its sole discretion to ensure compliance with international and local laws.  <br> <br> <br>

All rights reserved - {$companyName} 2024©</p>
	</div>
	<!-- svelte-ignore a11y-invalid-attribute -->
</footer>
