import { View, Text, Image, TouchableOpacity, FlatList, Alert } from "react-native";
import { useAuth } from "../../context/authContext";
import { useTransactions } from "../../hooks/useTransactions";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PageLoader from "../../components/PageLoader";
import { styles } from "../../assets/styles/home.styles";
import SignOutButton from "../../components/SignOutButton";
import { BalanceCard } from "../../components/BalanceCard";
import { TransactionItem } from "../../components/TransactionItem";
import NoTransactionsFound  from "../../components/NoTransactionsFound";
import { RefreshControl } from "react-native-gesture-handler";

export default function Home() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  
  
  const {transactions, summary, isLoading, loadData, deleteTransactions} = useTransactions(user?.uid);

  useEffect(() => {
    // Only load if we have a user ID
    if(user?.uid) {
        loadData();
    }
  }, [user?.uid, loadData]);

const onRefresh = async () =>{
  setRefreshing(true);
  await loadData();
  setRefreshing(false);
}

const handleDelete = (id) => {
  Alert.alert("Delete Transaction", "Are you sure you want to delete this transaction?", [
    { text: "Cancel", style: "cancel" },
    { text: "Delete", style: "destructive", onPress: () => deleteTransactions(id)},
  ])
}

 if(isLoading && !refreshing) return <PageLoader/>

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* HEADER */}
        <View style={styles.header}>
        {/* LEFT */}
        <View style={styles.headerLeft}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.usernameText}>
              {user?.email?.split("@")[0]}
            </Text>
          </View>
        </View>
        {/* RIGHT */}
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
            <Ionicons name="add" size={20} color="#FFF"/>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
          <SignOutButton/>
        </View>
        </View>

        <BalanceCard summary={summary}/>

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>
      </View>

      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={({ item }) =>  <TransactionItem item={item} onDelete={handleDelete}/>}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}

      />
    </View>
  );
}