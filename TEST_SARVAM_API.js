// Test Sarvam TTS API directly
// Run this in browser console to diagnose the issue

console.log("🧪 Testing Sarvam TTS API...\n");

const apiKey = "sk_zowequrd_zrtXw8mSv98IKs2QHIps1Fhd";
const baseUrl = "https://api.sarvam.ai/text-to-speech";

async function testSarvamAPI() {
  console.log("API Key:", apiKey.substring(0, 10) + "...");
  console.log("Endpoint:", baseUrl);
  console.log("\n📤 Sending test request...\n");

  try {
    // Try format 1: with inputs array
    console.log("Test 1: Using 'inputs' array format");
    const payload1 = {
      inputs: ["வணக்கம்"],
      target_language_code: "ta-IN"
    };
    console.log("Payload:", JSON.stringify(payload1, null, 2));

    const response1 = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": apiKey
      },
      body: JSON.stringify(payload1)
    });

    console.log("\nResponse Status:", response1.status);
    console.log("Response Headers:", Object.fromEntries(response1.headers.entries()));

    if (response1.ok) {
      const data1 = await response1.json();
      console.log("✅ SUCCESS! Response:", data1);
      return data1;
    } else {
      const errorText1 = await response1.text();
      console.log("❌ Error Response:", errorText1);
      
      try {
        const errorData1 = JSON.parse(errorText1);
        console.log("Parsed Error:", errorData1);
      } catch (e) {}
    }
  } catch (error) {
    console.error("❌ Network Error:", error);
  }

  // Try format 2: with text field
  console.log("\n\nTest 2: Using 'text' field format");
  const payload2 = {
    text: "வணக்கம்",
    target_language_code: "ta-IN",
    speaker: "meera"
  };
  console.log("Payload:", JSON.stringify(payload2, null, 2));

  try {
    const response2 = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": apiKey
      },
      body: JSON.stringify(payload2)
    });

    console.log("\nResponse Status:", response2.status);
    
    if (response2.ok) {
      const data2 = await response2.json();
      console.log("✅ SUCCESS! Response:", data2);
      return data2;
    } else {
      const errorText2 = await response2.text();
      console.log("❌ Error Response:", errorText2);
    }
  } catch (error) {
    console.error("❌ Network Error:", error);
  }
}

// Run the test
testSarvamAPI();

console.log("\n💡 Check above for which format works, then we can fix`xx the code!\n");
