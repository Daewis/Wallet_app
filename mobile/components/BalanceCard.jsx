import { View, Text } from "react-native";
import { styles } from "../assets/styles/home.styles";
import { COLORS } from "../constants/colors";

export const BalanceCard = ({ summary }) => {

    const formatCurrency = (value) => {
     
        const safeValue = value || 0;
        const num = parseFloat(safeValue);
        if (isNaN(num)) return "0.00";
        return Math.abs(num).toFixed(2);
    };

    return (
        <View style={styles.balanceCard}>
            <Text style={styles.balanceTitle}>Total Balance</Text>
            <Text style={styles.balanceAmount}>${formatCurrency(summary?.balance)}</Text>
            <View style={styles.balanceStats}>
                <View style={styles.balanceStatItem}>
                    <Text style={styles.balanceStatLabel}>Income</Text>
                    <Text style={[styles.balanceStatAmount, { color: COLORS.income }]}>
                        +${formatCurrency(summary?.income)}
                    </Text>
                </View>
                <View style={[styles.balanceStatItem, styles.statDivider]} />
                <View style={styles.balanceStatItem}>
                    <Text style={styles.balanceStatLabel}>Expenses</Text>
                    <Text style={[styles.balanceStatAmount, {color: COLORS.expense }]}>
                        -${formatCurrency(summary?.expense)}
                    </Text>
                </View>      
            </View>      
        </View>
    );
}