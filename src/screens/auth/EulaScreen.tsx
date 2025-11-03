import { Text, View } from 'react-native';
import { GuestContainer } from '../../components/layout/guest/GuestContainer';
import { ScreenTitle } from '../../components/layout/guest/ScreenTitle';

export function EulaScreen() {
  return (
    <GuestContainer>
      <View className="gap-6 pb-8">
        <ScreenTitle title="EULA" />
        <Text className="text-primary text-xl font-bold">End-User License Agreement (EULA)</Text>

        <Text className="text-primary text-base">Last updated: October 14, 2025</Text>

        <Text className="text-primary text-base">
            This End-User License Agreement ("EULA") is between Sandook LLC ("Sandook," "we," "us")
            and you and governs your use of the RushRanks mobile applications (the "App"). This
            EULA works with our Terms of Use, Privacy Policy, and CSAE Policy; if there's a
            conflict, the Terms govern the service/community, and this EULA governs the license to
            the App.
          </Text>

        <View className="gap-3">
          <Text className="text-primary text-lg font-semibold">1. License grant</Text>
          <Text className="text-primary text-base">
            Subject to your compliance with this EULA and the Terms, Sandook grants you a limited,
            personal, non-exclusive, non-transferable, revocable license to download, install, and
            run one copy of the App on a device you own or control in the United States for your
            own non-commercial use.
          </Text>
        </View>

        <View className="gap-3">
          <Text className="text-primary text-lg font-semibold">2. Restrictions</Text>
          <Text className="text-primary text-base">
            • No copying, modifying, translating, adapting, or creating derivative works of the
            App.{'\n'}• No reverse engineering or source extraction except where legally permitted.
            {'\n'}• No renting, leasing, selling, sublicensing, distributing, or transferring the
            App.{'\n'}• No bypassing or interfering with security or access-control features.
            {'\n'}• No bots, scripts, scrapers, or automation to access/interact with the App or
            rankings.{'\n'}• No uploading illegal or policy-violating content (including CSAE/CSAM).
            {'\n'}• No use of the App to build, train, or operate a competing service.
          </Text>
        </View>

        <View className="gap-3">
          <Text className="text-primary text-lg font-semibold">3. Ownership</Text>
          <Text className="text-primary text-base">
            The App is licensed, not sold. Sandook and its licensors own all rights in the App.
            Except for the license granted above, no rights are transferred.
          </Text>
        </View>

        <View className="gap-3">
          <Text className="text-primary text-lg font-semibold">4. User content</Text>
          <Text className="text-primary text-base">
            Your uploads and content are governed by the Terms of Use. You grant the rights
            necessary to host, process, display, and distribute your content within RushRanks,
            including for safety and legal compliance.
          </Text>
        </View>

        <View className="gap-3">
          <Text className="text-primary text-lg font-semibold">5. Updates; changes</Text>
          <Text className="text-primary text-base">
            We may provide updates or new versions, which may install automatically. Features may
            change or be discontinued. This EULA applies to updates unless an update is
            accompanied by a different license.
          </Text>
        </View>

        <View className="gap-3">
          <Text className="text-primary text-lg font-semibold">6. Devices, network, and third parties</Text>
          <Text className="text-primary text-base">
            You are responsible for required devices, OS versions, and data charges. The App may
            integrate third-party services (ads, analytics, hosting), which are subject to their
            own terms/policies.
          </Text>
        </View>

        <View className="gap-3">
          <Text className="text-primary text-lg font-semibold">7. Termination</Text>
          <Text className="text-primary text-base">
            This EULA is effective until terminated. It terminates automatically if you breach it
            or the Terms. We may suspend or terminate your access at any time for safety or legal
            reasons. Upon termination, stop using the App and delete all copies.
          </Text>
        </View>

        <View className="gap-3">
          <Text className="text-primary text-lg font-semibold">8. Disclaimers</Text>
          <Text className="text-primary text-base">
            THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE." TO THE FULLEST EXTENT PERMITTED BY
            LAW, SANDOOK DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
          </Text>
        </View>

        <View className="gap-3">
          <Text className="text-primary text-lg font-semibold">9. Limitation of liability</Text>
          <Text className="text-primary text-base">
            TO THE FULLEST EXTENT PERMITTED BY LAW, SANDOOK WILL NOT BE LIABLE FOR INDIRECT,
            INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR LOST PROFITS.
            OUR TOTAL LIABILITY FOR ANY CLAIM RELATING TO THE APP OR THIS EULA WILL NOT EXCEED USD
            $100 OR THE AMOUNT YOU PAID (IF ANY) FOR THE APP IN THE 12 MONTHS BEFORE THE CLAIM,
            WHICHEVER IS GREATER.
          </Text>
        </View>

        <View className="gap-3">
          <Text className="text-primary text-lg font-semibold">10. Indemnity</Text>
          <Text className="text-primary text-base">
            You agree to indemnify and hold Sandook harmless from claims, losses, and expenses
            (including reasonable attorneys' fees) arising from your breach of this EULA or misuse
            of the App.
          </Text>
        </View>

        <View className="gap-3">
          <Text className="text-primary text-lg font-semibold">11. Export & sanctions compliance</Text>
          <Text className="text-primary text-base">
            You represent you are not located in, under control of, or a national/resident of any
            country or party subject to U.S. embargo/sanctions and will not use the App in
            violation of export/sanctions laws.
          </Text>
        </View>

        <View className="gap-3">
          <Text className="text-primary text-lg font-semibold">12. App Store terms (Apple/Google)</Text>
          <Text className="text-primary text-base">
            If you downloaded the App from Apple's App Store, this EULA is between you and Sandook
            (not Apple). Apple is a third-party beneficiary and may enforce this EULA. Sandook is
            responsible for support/maintenance and claims regarding the App. You must also comply
            with App Store terms. Similar terms apply for Google Play.
          </Text>
        </View>

        <View className="gap-3">
          <Text className="text-primary text-lg font-semibold">13. Governing law; venue</Text>
          <Text className="text-primary text-base">
            This EULA is governed by Oregon law (USA), excluding conflict-of-law rules.
            Exclusive venue is in courts located in Portland, Oregon, unless applicable law
            requires a different forum.
          </Text>
        </View>

        <View className="gap-3">
          <Text className="text-primary text-lg font-semibold">14. Changes</Text>
          <Text className="text-primary text-base">
            We may modify this EULA; material changes will be noticed (e.g., in-app or on our
            site). Your continued use after the effective date means you agree to the updated
            EULA.
          </Text>
        </View>

        <View className="gap-3">
          <Text className="text-primary text-lg font-semibold">15. Contact</Text>
          <Text className="text-primary text-base">
            Sandook LLC — 9620 NE Tanasbourne Dr Ste 329, Hillsboro, OR 97124 — support@rushranks.com
          </Text>
        </View>
      </View>
    </GuestContainer>
  );
}

